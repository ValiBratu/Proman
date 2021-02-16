from flask import Flask, render_template, url_for, request, jsonify, redirect, make_response,session,escape

import data_handler

app = Flask(__name__)
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'
# session['id'] = 0
# session['logged_in'] = False
@app.route("/")
def index():
    if 'logged_in' not in dict(session):
        session['id'] = 0
        session['logged_in'] = False
    """
    This is a one-pager which shows all the boards and cards
    """

    return render_template('index.html')


@app.route("/get-boards")
def get_boards():
    if session['logged_in']:
        return jsonify(data_handler.get_user_boards(session['id']))
    else:
        return jsonify(data_handler.get_user_boards(0))


@app.route("/get-cards/<int:board_id>")
def get_cards_for_board(board_id: int):
    """
    All cards that belongs to a board
    :param board_id: id of the parent board
    """
    return jsonify(data_handler.get_cards_for_board(board_id))

@app.route('/add-board', methods=['GET', 'POST'])
def addboard():
    if request.method == "POST":
        max = data_handler.get_ids()
        newmax = int(max[0]['max']) + 1
        board_name = request.form["new-board-name"]
        if session['logged_in']:
            data_handler.add_board(board_name, newmax, session['id'])
        else:
            data_handler.add_board(board_name, newmax, 0)
        return redirect(url_for('index'))


@app.route('/add-card',methods=['GET','POST'])
def addcard():
    if request.method=='POST':
        cardorder = []
        req = request.get_json()
        max1 = data_handler.get_ids_cards()
        cardsforboard = data_handler.get_cards_for_board(req['board_id'])
        for card in cardsforboard:
            cardorder.append(card['card_order'])
        if len(cardorder) == 0:
            card_order = 1
        else:
            card_order = int(max(cardorder)) + 1
        new_id = int(max1[0]['max'])+1
        title = req['title']
        bd_id = req['board_id']
        status = req['status_id']
        data_handler.add_card(new_id, title, bd_id, status, card_order)
        res = make_response(jsonify({'id': new_id,'title': title,'board_id': bd_id,'status_id': status,'card_order': card_order}), 200)
        return res


@app.route('/edit-board-title', methods=['GET', 'POST'])
def edit_board_title():
    if request.method == "POST":
        req = request.get_json()
        board_id = req['boardid']
        board_title = req['boardname']
        data_handler.update_title(board_id, board_title)
        res = make_response(jsonify({'id': board_id, "title": board_title}))
        return res

@app.route('/delete-card',methods=['GET','POST'])
def del_card():
    if request.method=='POST':
        req=request.get_json()
        id=req['id']
        data_handler.delete_card(id)
        res=make_response(jsonify({'id':id}))
        return res

@app.route('/move-card', methods=['POST'])
def move_card():
    req = request.get_json()
    cardid = req['card_id']
    statusid = req['status_id']
    data_handler.update_card(cardid, statusid)
    res = make_response(jsonify({'cardid':cardid, 'statusid':statusid}))
    return res


@app.route('/edit-card-title', methods=['GET', 'POST'])
def edit_card_title():
    if request.method == "POST":
        req = request.get_json()
        card_id = req['card_id']
        card_title = req['card_title']
        data_handler.update_card_title(card_id, card_title)
        res = make_response(jsonify({'card_id': card_id, "card_title": card_title}))
        return res


@app.route('/change-card-order', methods=['POST'])
def change_card_order():
    req = request.get_json()
    to_replace_card_id = req['to_replace_id']
    to_replace_card_order = int(req['to_replace']) + 1
    dragged_card_id = req['dragged_id']
    dragged_order = req['to_replace']
    dragged_new_status = req['dragged_new_status']
    print(dragged_new_status)
    data_handler.update_card(dragged_card_id, dragged_new_status)
    data_handler.change_card_order(to_replace_card_id, to_replace_card_order)
    data_handler.change_card_order(dragged_card_id, dragged_order)
    res = make_response(jsonify({'to_replace_card_id': to_replace_card_id, 'to_replace_card_order': to_replace_card_order,
                                 'dragged_card_id': dragged_card_id, 'dragged_order': dragged_order}))
    return res


@app.route('/register',methods=['POST'])
def register():

    id=data_handler.get_ids_users()
    if(id[0]['max']==None):
        new_id=1
    else:
        new_id=id[0]['max']+1
    req = request.get_json()
    username=req['username']
    password=req['password']
    if data_handler.get_user_username(username):

        res=make_response(jsonify({'ok':'not'}))
        return res

    else:
        data_handler.add_user(new_id,username,password)
        res = make_response(jsonify({'ok': 'ok'}))
        return res


@app.route('/login',methods=['POST'])
def login():
    req=request.get_json()
    username=req['username']
    password=req['password']
    user=data_handler.get_user_username(username)

    if user:
        if user[0]['password']==password:
            session['logged_in']=True
            session['id']=user[0]['id']
            session['username']=user[0]['username']
            res = make_response(jsonify({'ok': 'ok'}))
            return res
        else:
            res = make_response(jsonify({'ok': 'not'}))
            return res
    else:
        res=make_response(jsonify({'ok':'not'}))
        return res


@app.route('/logout')
def logout():
    session.pop('username',None)
    session['logged_in']=False
    session.pop('id',None)
    return redirect(url_for('index'))


@app.route('/remove-board', methods=['POST'])
def remove_board():
    req = request.get_json()
    boardid = req['board_id']
    data_handler.remove_board(boardid)
    res = make_response(jsonify({'response': 'deleted'}))
    return res

def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
