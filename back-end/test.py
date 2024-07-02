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

# import pandas as pd

# file1_path = 'D:\\DATN\\model\\testOutput\\cust_x1.xlsx'
# file2_path = 'C:\\Users\\phank\\Downloads\\HuyNT_Thesis_RecSys_HandOver\\HuyNT_Thesis_RecSys_HandOver\\testOutput\\cust_x1.xlsx'

# df1 = pd.read_excel(file1_path)
# df2 = pd.read_excel(file2_path)

# # Ensure both dataframes have the same columns and shape
# if df1.shape != df2.shape:
#     print("The files have different shapes.")
# else:
#     differences = []
#     for row in range(df1.shape[0]):
#         for col in df1.columns:
#             if df1.at[row, col] != df2.at[row, col]:
#                 differences.append((row, col, df1.at[row, col], df2.at[row, col]))

# # Print the differences
# print("Differences found:")
# for diff in differences:
#     print(f"Row: {diff[0]}, Column: {diff[1]}, File1: {diff[2]}, File2: {diff[3]}")\
    

    
# import pandas as pd
# from openpyxl import load_workbook

# # Load the data
# house_df = pd.read_excel('D:\\DATN\\model\\houseAll.xls')
# data = pd.ExcelFile('D:\\DATN\\model\\data.xlsx')
# buyers = data.parse('buyers')

# def get_house_price(house_id):
#     house = house_df[house_df['meta_code'] == house_id]
#     price = house['price'].values[0]
#     return price

# # Input buyer and house details
# loan_amount = int(input('Nhập số tiền vay: '))
# house_id = input('Nhập id nhà: ')

# # Fetch available amount and property value
# available_amount = loan_amount
# property_value = get_house_price(house_id)

# # Input loan details
# annual_rate = int(input('Nhập lãi suất hàng năm (%): '))  # e.g., 12
# loan_term_months = int(input('Nhập thời hạn vay (tháng): '))     # e.g., 20
# # loan_term_months = loan_term_years * 12

# def calculate_reducing_balance_loan_schedule(principal, annual_rate, months):
#     monthly_rate = annual_rate / 12 / 100
#     monthly_principal = principal / months
    
#     schedule = []
#     remaining_principal = principal
    
#     for month in range(1, months + 1):
#         monthly_interest = remaining_principal * monthly_rate
#         total_payment = monthly_principal + monthly_interest
#         schedule.append({
#             'Month': month,
#             'Principal': monthly_principal,
#             'Interest': monthly_interest,
#             'Total Payment': total_payment,
#             'Remaining Principal': remaining_principal - monthly_principal
#         })
#         remaining_principal -= monthly_principal
    
#     return schedule

# def calculate_loan_summary(principal, annual_rate, months):
#     schedule = calculate_reducing_balance_loan_schedule(principal, annual_rate, months)
#     total_interest = sum(item['Interest'] for item in schedule)
#     max_payment_info = max(schedule, key=lambda x: x['Total Payment'])
#     total_payment = sum(item['Total Payment'] for item in schedule)
#     interest_to_payment_ratio = total_interest / total_payment
    
#     return {
#         'Total Interest': total_interest,
#         'Max Monthly Payment': max_payment_info['Total Payment'],
#         'Max Payment Month': max_payment_info['Month'],
#         'Total Payment': total_payment,
#         'Interest to Payment Ratio': interest_to_payment_ratio,
#         'Schedule': schedule
#     }

# # Check if loan is needed and calculate loan summary

# loan_amount = property_value - available_amount
# loan_summary = calculate_loan_summary(principal=loan_amount, annual_rate=annual_rate, months=loan_term_months)

# print(f'Giá nhà là {property_value} VND.')
# print(f"Tiền vay: {available_amount} VND.")
# print(f"Tổng lãi: {loan_summary['Total Interest']:.2f} VND")
# print(f"Tháng phải trả cao nhất là tháng {loan_summary['Max Payment Month']} với số tiền là {loan_summary['Max Monthly Payment']:.2f} VND.")
# print(f"Tổng tiền phải trả: {loan_summary['Total Payment']:.2f} VND")
# print(f"Tỉ lệ lãi phải trả trên khoản vay: {loan_summary['Interest to Payment Ratio']:.2f}")

# # Hiển thị bảng lịch trả nợ chi tiết
# print("\nLịch trả nợ chi tiết:")
# for item in loan_summary['Schedule']:
#     print(f"Tháng {item['Month']}: Gốc {item['Principal']:.2f}, Lãi {item['Interest']:.2f}, Tổng {item['Total Payment']:.2f}, Gốc còn lại {item['Remaining Principal']:.2f}")
# # import pandas as pd
# import unicodedata

# # Dữ liệu đầu vào
# buyerInfo = { 
#     'avai_amt': 2000000000,
#     'marital_status': 0, # 0 là Độc thân, 1 là Đã kết hôn
#     'no_child': 0,
#     'no_bedroom': 2, 
#     'desired_location': 'Quận 10'
# }

# houseInfo = { 
#     'price': 1800000000,
#     'bedroom': 2,
#     'legal_status': 'Sổ hồng',
#     'location': 'Quận 10'
# }

# # Hàm kiểm tra giá trị hợp lệ
# def isValidInput(x):
#     if x is None or pd.isna(x) or str(x).strip() == '': 
#         return False
#     return True

# def isNotNoneInput(x):
#     if x is None or pd.isna(x) or str(x).strip() == '':
#         return False
#     return True
    
# def isGoodLegalStatus(x):
#     if x is None or pd.isna(x) or str(x).strip() == '': 
#         return False
#     if x in ['Sổ hồng', 'Sổ đỏ']:
#         return True    
#     return False

# def fn_calculateDistance(srcPlace, tgtPlace):
#     # Giả sử đây là dữ liệu khoảng cách giữa các quận
#     distancesDf = pd.DataFrame({
#         'district_name': ['Quận 10', 'Quận 10'],
#         'district_name_2': ['Quận 1', 'Quận 10'],
#         'fn_calculate_distance': [4, 0]  # khoảng cách giữa các quận
#     })
#     res = distancesDf[(distancesDf.district_name == srcPlace) & (distancesDf.district_name_2 == tgtPlace)]
#     if len(res) == 0:
#         return 10000000  # Nếu không tìm thấy khoảng cách, trả về một giá trị lớn
#     return round(res.iloc[0]["fn_calculate_distance"], 2)

# # Điều chỉnh điểm số của các quy tắc
# ruleDf = pd.DataFrame({
#     'rule_group': ['group_1', 'group_2', 'group_3', 'group_4'],
#     'rule_expression': [
#         'houseInfo["price"] <= buyerInfo["avai_amt"]',
#         'houseInfo["bedroom"] in [1, 2]',
#         'isGoodLegalStatus(houseInfo["legal_status"])',
#         'fn_calculateDistance(houseInfo["location"], buyerInfo["desired_location"]) < 5'
#     ],
#     'score': [1.0, 3.0, 1.0, 0.0]  # Tăng nhẹ điểm số của các quy tắc
# })

# # Điều chỉnh điểm số của các nhóm quy tắc
# ruleGroupList = [
#     {
#         'rule_group': 'group_1',
#         'conditions': 'isValidInput(buyerInfo["avai_amt"])',
#         'group_point': 10
#     },
#     {
#         'rule_group': 'group_2',
#         'conditions': 'isNotNoneInput(houseInfo["price"])',
#         'group_point': 3
#     },
#     {
#         'rule_group': 'group_3',
#         'conditions': 'isValidInput(buyerInfo["desired_location"])',
#         'group_point': 5
#     },
#     {
#         'rule_group': 'group_4',
#         'conditions': 'isValidInput(buyerInfo["no_bedroom"])',
#         'group_point': 8
#     }
# ]

# # Hàm tính toán điểm của một quy tắc cụ thể
# def calculateSingleRuleScore(buyerInfo, houseInfo, ruleInfo, **kwargs):
#     for key, value in kwargs.items():
#         locals()[key] = value
#     ruleScore = ruleInfo.get("score")
#     ruleExpression = unicodedata.normalize('NFKD', ruleInfo.get("rule_expression")).strip()
#     exprValue = eval(ruleExpression)
#     if exprValue > 0:
#         return ruleScore
#     else:
#         return 0

# # Hàm tính toán điểm của một ngôi nhà
# def calculateScoreOfHouse(buyerInfo, houseInfo, ruleDf, ruleGroupList, isDebugRule=0):
#     pre_defined_kwargs = {}
#     _calRuleGroup = []
#     for ruleGroup in ruleGroupList:
#         groupCondition = unicodedata.normalize('NFKD', ruleGroup.get("conditions")).strip()
#         groupScore = float(ruleGroup.get("group_point"))
#         groupCode = ruleGroup.get("rule_group")
#         groupRes = {'groupCode': groupCode, 'groupCondition': groupCondition, 'groupScore': groupScore}
#         if isDebugRule == 1:
#             print("\tMã nhóm", groupCode, " | Điều kiện nhóm:", groupCondition)
#         if eval(groupCondition):
#             curRule = {}
#             curScore = 0
#             filteredRuleList = ruleDf[ruleDf['rule_group'] == groupCode].to_dict('records')
#             for r in filteredRuleList:
#                 _score = calculateSingleRuleScore(buyerInfo, houseInfo, r, **pre_defined_kwargs)
#                 if isDebugRule == 1:
#                     print(_score)
#                 if _score > 0 and _score > curScore:
#                     curRule = r
#                     curScore = _score
#             groupRes.update(curRule)
#             groupRes.update({'calRuleScore': curScore * groupScore})
#             _calRuleGroup.append(groupRes)
#     _maxScore = sum([g['groupScore'] for g in _calRuleGroup])
#     _totalScore = sum([g.get('calRuleScore', 0) for g in _calRuleGroup])
#     _housePerf = round((_totalScore / _maxScore) * 100, 2) if _maxScore != 0 else 0
#     _res = {'executedRuleGroup': _calRuleGroup, 'houseInfo': houseInfo,
#            'maxScore': _maxScore, 'houseScore': _totalScore, 'housePerformance': _housePerf,
#            'buyerInfo': buyerInfo}
#     _res.update(buyerInfo)
#     _res.update(houseInfo)
#     return _res

# # Tính điểm số của ngôi nhà dựa trên các quy tắc
# result = calculateScoreOfHouse(buyerInfo, houseInfo, ruleDf, ruleGroupList, isDebugRule=1)

# # Hiển thị kết quả theo format yêu cầu
# print(result)


import math

def haversine(lat1, lon1, lat2, lon2):
    R = 6371  # Earth radius in kilometers
    
    # Convert latitude and longitude from degrees to radians
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
    
    # Haversine formula
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    distance = R * c
    return distance

# Define the coordinates
lat1, lon1 = 10.71240234, 106.641777
lat2, lon2 = 10.77896976, 106.6198349

# Calculate the distance
distance = haversine(lat1, lon1, lat2, lon2)
print(f"The distance between the two points is {distance:.2f} kilometers.")
