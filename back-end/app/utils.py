import os
import nbformat as nbf
import papermill as pm

def assign_group(data):
    age = int(data['age'])
    marital_status = int(data['is_married'])
    no_child = int(data['no_child'])
    month_income = int(data['month_income'].replace(',', ''))
    # month_income = int(data['month_income'])
    
    if 25 <= age <= 32 and marital_status == 0 and no_child == 0 and month_income > 20000000:
        return 1
    elif 25 <= age <= 32 and marital_status == 1 and no_child < 4 and month_income > 20000000:
        return 2
    elif 40 <= age <= 50 and marital_status == 1 and no_child >= 2:
        return 3
    elif month_income > 70000000:
        return 4
    else:
        return 5

def add_code_to_callRule(notebook_path, id, row):
    if os.path.exists(notebook_path):
        with open(notebook_path, 'r', encoding='utf-8') as file:
            nb = nbf.read(file, as_version=4)
            
        code_cells = [cell for cell in nb.cells if cell.cell_type == 'code']
        if not code_cells:
            nb = nbf.v4.new_notebook()
    else:
        nb = nbf.v4.new_notebook()

    # write new code to notebook
    markdown_cell = nbf.v4.new_markdown_cell(f"Create csv and xlsx for {id}")
    nb.cells.append(markdown_cell)
    
    code = f"loadData()\nprint(buyers[{row}])\ncase_{id} = executeCase(custNo={row}, outputFileLocation=curDir + '\\\\testOutput\\\\cust_{id}')"
    code_cell = nbf.v4.new_code_cell(code)
    nb.cells.append(code_cell)

    with open (notebook_path, 'w', encoding='utf-8') as f:
        nbf.write(nb, f)
        
    # execute notebook
    pm.execute_notebook(notebook_path, 'D:\\DATN\\model\\outputCall.ipynb')
    
    # comment code after execute notebook
    commented_code = "# " + code.replace("\n", "\n# ")
    commented_code_cell = nbf.v4.new_code_cell(commented_code)
    nb.cells.remove(code_cell)
    nb.cells.append(commented_code_cell)
    
    with open (notebook_path, 'w', encoding='utf-8') as f:
        nbf.write(nb, f)
    
def add_code_to_outputEvaluation(notebook_path, data, row):
    if os.path.exists(notebook_path):
        with open(notebook_path, 'r', encoding='utf-8') as file:
            nb = nbf.read(file, as_version=4)
        
        code_cells = [cell for cell in nb.cells if cell.cell_type == 'code']
        if not code_cells:
            nb = nbf.v4.new_notebook()
            
    else:
        nb = nbf.v4.new_notebook()
    
    married = "chưa có gia đình" if data['is_married'] == 0 else "có gia đình"
    child = "chưa có con" if data['no_child'] == 0 else f"có {data['no_child']} con"
        
    markdown_cell = nbf.v4.new_markdown_cell(
        f"{data['id']}: Khách hàng {data['age']} tuổi, {married}, {child}.\n"
        f"Có sẵn {data['avai_amt']} VND. Có thể chi trả {data['monthly_amt']} mỗi tháng.\n"
        f"Cần tìm nhà ở {data['desired_location']} với {data['desired_interiorStatus']}."
    )
    nb.cells.append(markdown_cell)
    
    code_evaluationDf = (
        f"output= pd.read_excel('testOutput\\cust_{data['id']}.xlsx')"
        "\nevaluationDf = output[output['housePerformance'] >= 70].sort_values(by='housePerformance', ascending=False)"
        "\nprint('Số lượng >= 70%: ', len(evaluationDf))"
        "\nprint('Điểm cao nhất: ', evaluationDf.iloc[0]['housePerformance'])"
        "\nprint('Điểm thấp nhất: ', evaluationDf.iloc[-1]['housePerformance'])"
        "\nprint(evaluationDf[['address_district', 'in_room_noBed', 'price', 'legal_status']])"
    )
    code_cell_evaluationDf = nbf.v4.new_code_cell(code_evaluationDf)
    nb.cells.append(code_cell_evaluationDf)
    
    with open(notebook_path, 'w', encoding='utf-8') as f:
        nbf.write(nb, f)

    pm.execute_notebook(notebook_path, notebook_path)