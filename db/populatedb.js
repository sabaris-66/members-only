require("dotenv").config();
const { Client } = require("pg");

const SQL = `
create table if not exists members (
    member_id integer primary key generated always as identity,
    first_name varchar(255),
    last_name varchar(255),
    password varchar(255),
    status varchar(255)
);

create table if not exists messages(
    message_id integer primary key generated always as identity,
    message varchar(255),
    date varchar(255),
    member_id integer,
    constraint fk_member foreign key (member_id)
    references members(member_id)
);

insert into members (first_name, last_name, password, status)
values ('saba', 'saba', 'bigBull@9', 'admin');

insert into messages (message, date,  member_id)
values ('Wake Up','Good time :)', 1);
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
