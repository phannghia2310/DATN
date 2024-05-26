from flask_restx import fields, Api

def create_data_model(api: Api):
    return api.model('DataModel', {
        'id': fields.String(required=True, description='ID', example='X2'),
        'name': fields.String(required=True, description='Name', example='Phan Nghia'),
        'email': fields.String(required=True, description='Email', example='test@gmail.com'),
        'password': fields.String(required=True, description='Password', example='test123'),
        'phone_number': fields.String(required=True, description='Phone number', example='0123456789'),
        'address': fields.String(required=True, description='Address', example='Quận 9, Tp. Hồ Chí Minh'),
        'image': fields.String(required=True, description='Image', example='image.jpg'),
        'group': fields.Integer(required=True, description='Group', example=1),
        'age': fields.Integer(required=True, description='Age', example=30),
        'is_married': fields.Integer(required=True, description='Marital status', example=1),
        'no_child': fields.Integer(required=True, description='Number of children', example=0),
        'month_income': fields.Integer(required=True, description='Month income', example=30000000),
        'monthly_amt': fields.Integer(required=True, description='Monthly amount', example=30000000),
        'avai_amt': fields.Integer(required=True, description='Available amount', example=4000000000),
        'desired_location': fields.String(required=True, description='Desired location', example='Quận 7'),
        'desired_interiorStatus': fields.String(required=True, description='Desired interior status', example='Nội thất đầy đủ')
    })
