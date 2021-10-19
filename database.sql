CREATE DATABASE towatch ; 

CREATE TABLE users(
    user_id uuid PRIMARY KEY DEFAULT  
    uuid_generate_v4()  NOT NULL,
    user_name varchar(30)  NOT NULL,
    user_email varchar(50) NOT NULL, 
    user_password varchar(40)  NOT NULL
);
INSERT INTO users (user_name , user_email , user_password) VALUES ('fatima' , 'fatima@gmail.com' , '11111');

ALTER TABLE users 
DROP COLUMN user_password ;

ALTER TABLE users 
ADD COLUMN user_password  varchar(200);