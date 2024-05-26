from flask import request, Response
from flask_restx import Resource, Api
from openpyxl import load_workbook
import pandas as pd
import numpy as np
import json
import os
import re

from app.models import create_data_model
from app.utils import assign_group
from app.utils import add_code_to_callRule

def register_routes(api: Api):
    data_model = create_data_model(api)

    @api.route('/get_all_houses')
    class GetAllHouse(Resource):
        def get(self):
            file_path = 'D:\\DATN\\model\\houseAll.xls'
            
            if not os.path.exists(file_path):
                return Response(json.dumps({"error": "File not found"}), content_type="application/json", status=404)
            
            df = pd.read_excel(file_path)
            df = df.replace({np.nan: None})
            data = df.to_dict(orient='records')
            data_json = json.dumps(data, ensure_ascii=False, indent=4)
            return Response(data_json, content_type="application/json; charset=utf-8")
    
    @api.route('/get_house/<meta_code>')
    class GetHouseByMetaCode(Resource):
        def get(self, meta_code):
            file_path = 'D:\\DATN\\model\\houseAll.xls'
            
            if not os.path.exists(file_path):
                return Response(json.dumps({"error": "File not found"}), content_type="application/json", status=404)
            
            df = pd.read_excel(file_path)
            df = df.replace({np.nan: None})
            house = df[df['meta_code'] == meta_code].to_dict(orient='records')
            
            if not house:
                return Response(json.dumps({"error": "House not found"}), content_type="application/json", status=404)
            
            data_json = json.dumps(house[0], ensure_ascii=False, indent=4)
            return Response(data_json, content_type="application/json; charset=utf-8")
        
    @api.route('/get_houses_from_model')
    class GetHouseFromModel(Resource):
        def get(self):
            data_path = 'D:\\DATN\\model\\data.xlsx'
            wb = load_workbook(filename=data_path)
            sheet = wb['buyers']
            
            last_row_id = None
            for row in sheet.iter_rows(min_row=2, max_col=1, max_row=sheet.max_row):
                cell_value = row[0].value
                if cell_value:
                    last_row_id = cell_value
                    
            file_path = f'D:\\DATN\\model\\testOutput\\cust_{last_row_id}.xlsx'
            
            if not os.path.exists(file_path):
                return Response(json.dumps({"error": "File not found"}), content_type="application/json", status=404)
            
            df = pd.read_excel(file_path)
            df = df.drop(df.columns[[1, 2]], axis=1)
            df = df.replace({np.nan: None})
            data = df.to_dict(orient='records')
            data_json = json.dumps(data, ensure_ascii=False, indent=4)
            return Response(data_json, content_type="application/json; charset=utf-8")
        
    @api.route('/create_user')
    class CreateUser(Resource):
        @api.expect(data_model)
        def post(self):
            data = request.get_json()
            file_path = 'D:\\DATN\\model\\data.xlsx'
            wb = load_workbook(filename=file_path)
            buyers_sheet = wb['buyers']
            buyers_info_sheet = wb['buyers_info']
            
            none_rows = [row for row in buyers_sheet.iter_rows() if all(cell.value is None for cell in row)]
            for row in none_rows:
                buyers_sheet.delete_rows(row[0].row)
                
            # get data['id']
            last_row_id = None
            for row in buyers_info_sheet.iter_rows(min_row=2, max_col=1, max_row=buyers_info_sheet.max_row):
                cell_value = row[0].value
                if cell_value:
                    last_row_id = cell_value
                    
            if last_row_id:
                prefix, numeric_part = re.match(r'([^\d]+)(\d+)', last_row_id).groups()
                next_numeric_part = int(numeric_part) + 1
                data['id'] = f'{prefix}{next_numeric_part}'
            else:
                data['id'] = 'x1'
                
            #get data['group']
            data['group'] = assign_group(data)
            
            buyers_info_row = [data['id'], data['name'], data['email'], data['password'], data['phone_number'], data['address'], data['image']]
            
            # buyers_row = [data['id'], data['group'], int(data['age']), data['is_married'],
            #     data['no_child'], int(data['month_income'].replace(',','')), int(data['monthly_amt'].replace(',','')),
            #     int(data['avai_amt'].replace(',','')), data['desired_location'], data['desired_interiorStatus']]
            
            buyers_row = [data['id'], data['group'], int(data['age']), data['is_married'],
                data['no_child'], int(data['month_income']), int(data['monthly_amt']),
                int(data['avai_amt']), data['desired_location'], data['desired_interiorStatus']]
            
            buyers_info_sheet.append(buyers_info_row)
            buyers_sheet.append(buyers_row)
            wb.save(filename=file_path)
            
            # add_code_to_callRule(notebook_path, data['id'], buyers_sheet.max_row - 2)
            
            return 'User created successfully!', 200
        
    @api.route('/update_user/<id>')
    class UpdateUser(Resource):
        @api.expect(data_model)
        def put(self, id):
            data = request.get_json()
            file_path = 'D:\\DATN\\model\\data.xlsx'
            wb = load_workbook(filename=file_path)
            buyers_sheet = wb['buyers']
            buyers_info_sheet = wb['buyers_info']
            
            # Find and update the row in 'buyers_info' sheet
            for row in buyers_info_sheet.iter_rows(min_row=2, max_row=buyers_info_sheet.max_row):
                if row[0].value == id:
                    row[1].value = data.get('name', row[1].value)
                    row[2].value = data.get('email', row[2].value)
                    row[3].value = data.get('password', row[3].value)
                    row[4].value = data.get('phone_number', row[4].value)
                    row[5].value = data.get('address', row[5].value)
                    row[6].value = data.get('image', row[6].value)
                    break
            
            # Find and update the row in 'buyers' sheet
            for row in buyers_sheet.iter_rows(min_row=2, max_row=buyers_sheet.max_row):
                if row[0].value == id:
                    row[1].value = assign_group(data)
                    row[2].value = int(data.get('age', row[2].value))
                    row[3].value = data.get('is_married', row[3].value)
                    row[4].value = data.get('no_child', row[4].value)
                    row[5].value = int(data.get('month_income', row[5].value)) # write .replace(',','') when run front-end
                    row[6].value = int(data.get('monthly_amt', row[6].value)) # write .replace(',','') when run front-end
                    row[7].value = int(data.get('avai_amt', row[7].value)) # write .replace(',','') when run front-end
                    row[8].value = data.get('desired_location', row[8].value)
                    row[9].value = data.get('desired_interiorStatus', row[9].value)
                    break
                
            wb.save(filename=file_path)
            
            return 'User updated successfully!', 200
        
    @api.route('/run_model/<id>')
    class RunModel(Resource):
        def get(self, id):
            file_path = 'D:\\DATN\\model\\data.xlsx'
            notebook_path = 'D:\\DATN\\model\\callRule.ipynb'
            wb = load_workbook(filename=file_path)
            buyers_sheet = wb['buyers']
            row_number = None
            
            for row in buyers_sheet.iter_rows(min_row=2, max_row=buyers_sheet.max_row):
                if row[0].value == id:
                    row_number = row[0].row - 2
                    break

            add_code_to_callRule(notebook_path, id, row_number)
            
            return 'Runed model successfully!', 200     