from typing import List, Dict

from psycopg2 import sql
from psycopg2.extras import RealDictCursor

import database_common
@database_common.connection_handler
def get_card_status(cursor: RealDictCursor, status_id) -> list:
    query = """
            SELECT name
            FROM statuses
            WHERE id = %(status_id)s"""
    cursor.execute(query, {'status_id': status_id})
    status = cursor.fetchone()
    return status['name']


@database_common.connection_handler
def get_boards(cursor: RealDictCursor) -> list:
    """
    Gather all boards
    :return:
    """
    query = """
                SELECT *
                FROM boards
                ORDER BY id ASC """
    cursor.execute(query)
    return cursor.fetchall()

@database_common.connection_handler
def get_user_boards(cursor: RealDictCursor, id) -> list:
    """
    Gather all boards
    :return:
    """
    query = """
                SELECT *
                FROM boards
                WHERE user_id = %(id)s
                ORDER BY id ASC """
    cursor.execute(query, {'id': id})
    return cursor.fetchall()

@database_common.connection_handler
def get_cards_for_board(cursor: RealDictCursor, board_id) -> list:
    query = """
                SELECT *
                FROM cards
                WHERE board_id = %(board_id)s
                ORDER BY card_order"""
    cursor.execute(query, {'board_id': board_id})
    return cursor.fetchall()


def add_board(board_title, id, user_id):
    con = database_common.open_database()
    cursor = con.cursor()
    query = """
                INSERT INTO boards (id, title, is_active, user_id)
                VALUES (%(id)s, %(board_title)s, 'True', %(user_id)s)"""
    cursor.execute(query, {'board_title': board_title, 'id': id, 'user_id': user_id})
    cursor.close()
    con.close()

@database_common.connection_handler
def get_ids(cursor: RealDictCursor) -> list:
    query = """
                SELECT MAX(id)
                FROM boards"""
    cursor.execute(query)
    return cursor.fetchall()

def add_card(id,title,board_id,status_id,card_order):
    con=database_common.open_database()
    cursor=con.cursor()
    query="""
    INSERT INTO cards (id, title, board_id, status_id, card_order)
    VALUES (%(id)s , %(title)s ,%(board_id)s,%(status_id)s,%(card_order)s)"""
    cursor.execute(query,{'id':id,'title':title,'board_id':board_id,'status_id':status_id,'card_order':card_order})
    cursor.close()
    con.close()

@database_common.connection_handler
def get_ids_cards(cursor: RealDictCursor) -> list:
    query = """
                SELECT MAX(id)
                FROM cards"""
    cursor.execute(query)
    return cursor.fetchall()

def update_title(board_id, title):
    con=database_common.open_database()
    cursor=con.cursor()
    query="""
    UPDATE boards
    SET title =  %(title)s
    WHERE id = %(board_id)s"""
    cursor.execute(query,{'board_id': board_id, 'title': title})
    cursor.close()
    con.close()


def update_card_title(card_id, title):
    con=database_common.open_database()
    cursor=con.cursor()
    query="""
    UPDATE cards
    SET title =  %(title)s
    WHERE id = %(card_id)s"""
    cursor.execute(query,{'card_id': card_id, 'title': title})
    cursor.close()
    con.close()


def delete_card(id):
    con=database_common.open_database()
    cursor=con.cursor()
    query="""
    DELETE FROM cards
    WHERE id=%(id)s; 
    """
    cursor.execute(query,{'id':id})
    cursor.close()
    con.close()

@database_common.connection_handler
def get_card_by_id(cursor: RealDictCursor,id) -> list:
    query = """
                SELECT *
                FROM cards
                WHERE id=%(id)s"""
    cursor.execute(query,{'id':id})
    return cursor.fetchall()

def update_card(card_id, status_id):
    con=database_common.open_database()
    cursor=con.cursor()
    query="""
    UPDATE cards
    SET status_id =  %(status_id)s
    WHERE id = %(card_id)s"""
    cursor.execute(query,{'card_id': card_id, 'status_id': status_id})
    cursor.close()
    con.close()

def change_card_order(id, order):
    con = database_common.open_database()
    cursor = con.cursor()
    query = """
        UPDATE cards
        SET card_order =  %(order)s
        WHERE id = %(id)s"""
    cursor.execute(query, {'id': id, 'order': order})
    cursor.close()
    con.close()

def add_user(id,username,password):
    con = database_common.open_database()
    cursor = con.cursor()
    query = """
        INSERT INTO users (id,username,password) VALUES (%(id)s,%(username)s,%(password)s);"""
    cursor.execute(query, {'id':id,'username': username, 'password': password})
    cursor.close()
    con.close()


def remove_board(id):
    con = database_common.open_database()
    cursor = con.cursor()
    query = """
        DELETE FROM boards WHERE id = %(id)s;"""
    cursor.execute(query, {'id': id})
    cursor.close()
    con.close()

@database_common.connection_handler
def get_user_username(cursor: RealDictCursor,username)->list:
    query = """
                SELECT *
                FROM users
                WHERE username=%(username)s"""
    cursor.execute(query,{'username':username})
    return cursor.fetchall()


@database_common.connection_handler
def get_ids_users(cursor: RealDictCursor) -> list:
    query = """
                SELECT MAX(id)
                FROM users"""
    cursor.execute(query)
    return cursor.fetchall()

