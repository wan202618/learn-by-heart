from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # 解决跨域问题

# 模拟数据库（包含初始密码）
user_profile = {
    "nickname": "请输入",
    "phone": "",
    "email": "@qq.com",
    "signature": "",
    "password": ""  # 初始密码，可自行修改
}


# 1. 获取个人信息接口
@app.route('/api/user/profile', methods=['GET'])
def get_profile():
    return jsonify(user_profile)


# 2. 修改个人信息接口
@app.route('/api/user/profile', methods=['PUT'])
def update_profile():
    global user_profile
    data = request.get_json()
    user_profile.update(data)
    return jsonify({"code": 0, "msg": "个人信息保存成功"})


# 3. 修改密码接口（通过手机号验证）
@app.route('/api/user/password', methods=['PUT'])
def update_password():
    global user_profile
    data = request.get_json()

    # 校验手机号是否与绑定手机号一致
    if data.get('phone') != user_profile.get('phone'):
        return jsonify({"code": -1, "msg": "手机号与绑定手机号不匹配"}), 400

    # 更新密码（正式环境请使用加密存储，如 bcrypt）
    user_profile['password'] = data.get('newPassword')
    return jsonify({"code": 0, "msg": "密码修改成功"})


if __name__ == '__main__':
    app.run(debug=True, port=5000)