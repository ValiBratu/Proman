CREATE TABLE statuses (
	id serial PRIMARY KEY,
	name VARCHAR(50)
);
CREATE TABLE boards (
	id serial PRIMARY KEY,
	title VARCHAR(100),
	is_active boolean,
	user_id integer
);
CREATE TABLE cards (
	id serial PRIMARY KEY,
	title VARCHAR(100),
	board_id integer REFERENCES boards(id),
	status_id integer REFERENCES statuses(id),
	card_order integer
);
CREATE TABLE users (
	id serial PRIMARY KEY,
	username VARCHAR(50) not null,
	password VARCHAR(250) not null
);

alter table cards drop constraint cards_board_id_fkey;

alter table cards
	add constraint cards_board_id_fkey
		foreign key (board_id) references boards
			on update cascade on delete cascade;

INSERT INTO statuses (id, name) VALUES
	(1, 'New'),
	(2, 'In Progress'),
	(3, 'Testing'),
	(4, 'Done');
	

INSERT INTO boards (id, title, is_active, user_id) VALUES
	(1, 'Test Board 1', true, 0),
	(2, 'Test Board 2', true, 0),
	(3, 'Test Board 3', true, 0),
	(4, 'Test Board 4', true, 0);
	
INSERT INTO cards (id, title, board_id, status_id, card_order) VALUES
	(1, 'task1', 1, 1, 3),
	(2, 'task2', 1, 2, 2),
	(3, 'task3', 1, 4, 1),
	(4, 'task4', 2, 1, 3),
	(5, 'task5', 2, 2, 2),
	(6, 'task6', 2, 3, 1);

