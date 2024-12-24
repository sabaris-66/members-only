require("dotenv").config();
const { Client } = require("pg");

const SQL = `
create table if not exists members (
    memberId integer generated always as identity,
    username varchar(255) primary key,
    fullName varchar(255),
    password varchar(255),
    status varchar(255)
);

create table if not exists messages(
    messageId integer primary key generated always as identity,
    message varchar(255),
    date varchar(255),
    username varchar(255),
    constraint fkMember foreign key (username)
    references members(username)
);

insert into members (username, fullName, password, status)
values ('saba', 'saba', 'bigBull@9', 'admin');

insert into messages (message, date,  username)
values ('Wake Up','Good time :)', 'saba');
`;

async function main() {
  console.log("seeding");
  const client = new Client({
    connectionString: process.env.DB_URL,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();
