# from flask import Flask, request, Response
# from flask_restx import Api, Resource, fields
# from flask_cors import CORS
# from openpyxl import load_workbook
# from IPython.display import display, Javascript
# import pandas as pd
# import numpy as np
# import json
# import papermill as pm
# import nbformat as nbf
# import os

# app = Flask(__name__)
# api = Api(app)

# CORS(app, origins=['http://localhost:3000', 'http://example.com'])

# data_model = api.model('DataModel', {
#     'id': fields.String(required=True, description='ID', example='X2'),
#     'group': fields.Integer(required=True, description='Group', example=1),
#     'age': fields.Integer(required=True, description='Age', example=30),
#     'is_married': fields.Integer(required=True, description='Marital status', example=1),  # 1: married,  0: single/divorced/separ
#     'no_child': fields.Integer(required=True, description='Number of children', example=0),
#     'month_income': fields.Integer(required=True, description='Month income', example=30000000),
#     'monthly_amt': fields.Integer(required=True, description='Monthly amount', example=30000000),
#     'avai_amt': fields.Integer(required=True, description='Available amount', example=4000000000),
#     'desired_location': fields.String(required=True, description='Desired location', example='Quận 7'),
#     'desired_interiorStatus': fields.String(required=True, description='Desired interior status', example='Nội thất đầy đủ')
# })

# def add_code_to_callRule(notebook_path, id, row):
#     if os.path.exists(notebook_path):
#         with open(notebook_path, 'r', encoding='utf-8') as file:
#             nb = nbf.read(file, as_version=4)
            
#         code_cells = [cell for cell in nb.cells if cell.cell_type == 'code']
#         if not code_cells:
#             nb = nbf.v4.new_notebook()
#     else:
#         nb = nbf.v4.new_notebook()

#     markdown_cell = nbf.v4.new_markdown_cell(f"Create csv and xlsx for {id}")
#     nb.cells.append(markdown_cell)
    
#     code = f"print(buyers[{row}])\ncase_{id} = executeCase(custNo={row}, outputFileLocation='testOutput\\\cust_{id}')"
#     code_cell = nbf.v4.new_code_cell(code)
#     nb.cells.append(code_cell)

#     with open (notebook_path, 'w', encoding='utf-8') as f:
#         nbf.write(nb, f)
        
#     # pm.execute_notebook(notebook_path, notebook_path)
    
# def add_code_to_outputEvaluation(notebook_path, data, row):
#     if os.path.exists(notebook_path):
#         with open(notebook_path, 'r', encoding='utf-8') as file:
#             nb = nbf.read(file, as_version=4)
        
#         code_cells = [cell for cell in nb.cells if cell.cell_type == 'code']
#         if not code_cells:
#             nb = nbf.v4.new_notebook()
            
#     else:
#         nb = nbf.v4.new_notebook()
    
#     married = ""
#     child = ""
    
#     if data['is_married'] == 0:
#         married = "chưa có gia đình"
#     else:
#         married = "có gia đình"
        
#     if data['no_child'] == 0:
#         child = "chưa có con"
#     else:
#         child = f"có {data['no_child']} con"
        
#     markdown_cell = nbf.v4.new_markdown_cell(f"{data['id']}: Khách hàng {data['age']}  tuổi, chưa có gia đình, {married}, {child}.\n  Có sẵn {data['avi_amt']} VND. Có thể chi trả {data['monthly_amt']} mỗi tháng.\n  Cần tìm nhà {data['desired_location']}")
#     nb.cells.append(markdown_cell)
    
#     code_evaluationDf = (f"output= pd.read_excel('testOutput\\cust_x1.xlsx')"
#                          "\nprint(len(output))"
#                          "\nevaluationDf= output[output['housePerformance'] >= 70].sort_values(by='housePerformance', ascending=False)"
#                          "\nprint(len(output))"
#                          "\nprint('Số lượng >= 70%: ', len(evaluationDf))"
#                          "\nprint(evaluationDf.iloc[0]['housePerformance'])"
#                          "\nprint(evaluationDf.iloc[-1]['housePerformance'])"
#                          "\nprint(evaluationDf.keys())"
#                          "\nprint(evaluationDf['legal_status'].unique())")
#     code_cell_evaluationDf = nbf.v4.new_code_cell(code_evaluationDf)
#     nb.cells.append(code_cell_evaluationDf)
    
#     code_loop = (f"for i in range(len(evaluationDf)):"
#                  "\nprint('Record no ', i+1,'. Id: ', evaluationDf.iloc[i]['housePerformance'])"
#                  "\nprint('Quan huyen: ', evaluationDf.iloc[i][ 'address_district'],"
#                  "\n    ' . So phong ngu: ', evaluationDf.iloc[i][ 'in_room_noBed'],"
#                  "\n    ' . Gia ban: ', evaluationDf.iloc[i][ 'price'],"
#                  "\n    ' . Gia ban: ', evaluationDf.iloc[i][ 'price'],"
#                  "\n    ' . Tinh trang phap ly: ', evaluationDf.iloc[i][ 'legal_status'],"
#                  "\n    )")                     
#     code_cell_loop = nbf.v4.new_code_cell(code_loop)
#     nb.cells.append(code_cell_loop)
    
    
             
#     code_cell = nbf.v4.new_code_cell()

# @api.route('/get_all_house')
# class GetAllHouse(Resource):
#     def get(self):
#         file_path = 'D:\\DATN\\model\\houseAll.xls'
        
#         if not os.path.exists(file_path):
#             return Response(json.dumps({"error": "File not found"}), content_type="application/json", status=404)
        
#         df = pd.read_excel(file_path)
        
#         df = df.replace({np.nan: None})
        
#         data = df.to_dict(orient='records')
        
#         data_json = json.dumps(data, ensure_ascii=False, indent=4)
        
#         return Response(data_json, content_type="application/json; charset=utf-8")
        

# @api.route('/add_data')
# class AddData(Resource):
#     @api.expect(data_model)
#     def post(self):
#         data = request.get_json()
#         # data = data.split(',')  # Chuyển dữ liệu thành list

#         wb = load_workbook(filename='model/data.xlsx')
#         sheet = wb['buyers']

#         none_rows = [row for row in sheet.iter_rows() if all(cell.value is None for cell in row)]
#         for row in none_rows:
#             sheet.delete_rows(row[0].row)

#         sheet.append(list(data.values()))  # Thêm dữ liệu từ form vào sheet

#         wb.save(filename='model/data.xlsx')
        
#         add_code_to_callRule('model/callRule.ipynb', data['id'], sheet.max_row - 2)

#         return 'Data added successfully!', 200

# if __name__ == '__main__':
#     app.run(debug=True)