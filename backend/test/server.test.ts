import { Entry } from "@prisma/client";
import { FastifyInstance } from "fastify";
import request from "supertest";
import { isExportDeclaration } from "typescript";
import Prisma from "../src/db";
import { server } from "../src/server";

let fastify: FastifyInstance;

// test entry #1
const title: string = "test title";
const description: string = "test description";
const created_at: Date = new Date();
const scheduled_at: Date = new Date();

// test entry #2
const titleTwo: string = "test title #2";
const descriptionTwo: string = "test description #2";
const created_atTwo: Date = new Date();
const scheduled_atTwo: Date = new Date();

// test entry without scheduled_at field
const titleC: string = "test title C";
const descriptionC: string = "test description C";
const created_atC: Date = new Date();

const testEntryOne = <Entry>{
  title: title,
  description: description,
  created_at: created_at,
  scheduled_at: scheduled_at,
};

const testEntryTwo = <Entry>{
  title: titleTwo,
  description: descriptionTwo,
  created_at: created_atTwo,
  scheduled_at: scheduled_atTwo,
};

const testEntryC = <Entry>{
  title: titleC,
  description: descriptionC,
  created_at: created_atC,
};

beforeAll(async () => {
  fastify = server;
  await server.listen(3001);
});

afterAll(async () => {
  await Prisma.$disconnect();
  fastify.close();
});

beforeEach(async () => {
  await Prisma.entry.deleteMany();
});

describe("server test", () => {
  // create new entry
  it("should create new entry", async () => {
    // create test entry
    let response = await request(fastify.server).post("/create/").send(testEntryOne);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("title");
    expect(response.body.title).toBe(title);
    expect(response.body).toHaveProperty("description");
    expect(response.body.description).toBe(description);
    expect(response.body).toHaveProperty("created_at");
    expect(response.body.created_at).toBe(created_at.toISOString());
    expect(response.body).toHaveProperty("scheduled_at");
    expect(response.body.scheduled_at).toBe(scheduled_at.toISOString());

    const insertedEntry = response.body;
    const id = insertedEntry.id;

    // check that new entry still exists
    response = await request(fastify.server).get(`/get/${id}`);
    expect(response.statusCode).toEqual(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body.id).toBe(id);
    expect(response.body).toHaveProperty("title");
    expect(response.body.title).toBe(title);
    expect(response.body).toHaveProperty("description");
    expect(response.body.description).toBe(description);
    expect(response.body).toHaveProperty("created_at");
    expect(response.body.created_at).toBe(created_at.toISOString());
    expect(response.body).toHaveProperty("scheduled_at");
    expect(response.body.scheduled_at).toBe(scheduled_at.toISOString());

    // check that new entry is inserted among all entries
    response = await request(fastify.server).get(`/get/`);
    expect(response.statusCode).toEqual(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toContainEqual(insertedEntry);
  });

  // create new entry without scheduled date
  it("should create new entry without scheduled date", async () => {
    let response = await request(fastify.server).post("/create/").send(testEntryC);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("title");
    expect(response.body.title).toBe(titleC);
    expect(response.body).toHaveProperty("description");
    expect(response.body.description).toBe(descriptionC);
    expect(response.body).toHaveProperty("created_at");
    expect(response.body.created_at).toBe(created_atC.toISOString());
    expect(response.body).toHaveProperty("scheduled_at");
    expect(response.body.scheduled_at).toBe(null);
  });

  // get all entries
  it("should get all entries", async () => {
    // get all entries of empty database
    let response = await request(fastify.server).get(`/get/`);
    expect(response.statusCode).toEqual(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toEqual(0);

    // create test entry #1
    response = await request(fastify.server).post("/create/").send(testEntryOne);
    const insertedEntryOne = response.body;

    // get all entries of a database of one entry
    response = await request(fastify.server).get(`/get/`);
    expect(response.statusCode).toEqual(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toEqual(1);
    expect(response.body).toContainEqual(insertedEntryOne);

    // create test entry #2
    response = await request(fastify.server).post("/create/").send(testEntryTwo);
    const insertedEntryTwo = response.body;

    // get all entries of a database of two entries
    response = await request(fastify.server).get(`/get/`);
    expect(response.statusCode).toEqual(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toEqual(2);
    expect(response.body).toContainEqual(insertedEntryOne);
    expect(response.body).toContainEqual(insertedEntryTwo);
  });

  // update entry
  it("should update entry", async () => {
    // update non-existent entry

    let response = await request(fastify.server).put(`/update/non-existent`).send(testEntryTwo);
    expect(response.status).toEqual(500);
    expect(response.body).toHaveProperty("msg", "Error updating");

    // update existing test entry
    // create test entry
    response = await request(fastify.server).post("/create/").send(testEntryOne);
    const insertedEntryOne = response.body;
    const idOne = insertedEntryOne.id;

    // update test entry
    response = await request(fastify.server).put(`/update/${idOne}`).send(testEntryTwo);

    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty("msg", "Updated successfully");

    // check that entry is updated
    response = await request(fastify.server).get(`/get/${idOne}`);

    const insertedEntryTwo = response.body;
    const idTwo = insertedEntryOne.id;

    expect(response.statusCode).toEqual(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body.id).toBe(idOne);
    expect(response.body).toHaveProperty("title");
    expect(response.body.title).toBe(titleTwo);
    expect(response.body).toHaveProperty("description");
    expect(response.body.description).toBe(descriptionTwo);
    expect(response.body).toHaveProperty("created_at");
    expect(response.body.created_at).toBe(created_atTwo.toISOString());
    expect(response.body).toHaveProperty("scheduled_at");
    expect(response.body.scheduled_at).toBe(scheduled_atTwo.toISOString());

    // check that entry is updated among all entries
    response = await request(fastify.server).get(`/get/`);
    expect(response.statusCode).toEqual(200);
    expect(response.body.length).toEqual(1);
    expect(response.body).not.toContainEqual(insertedEntryOne);
    expect(response.body).toContainEqual(insertedEntryTwo);
  });

  // update entry without scheduled date to have scheduled date
  it("should update unscheduled entry", async () => {
    // create test entry without scheduled date
    let response = await request(fastify.server).post("/create/").send(testEntryC);
    const insertedEntryC = response.body;
    const idC = insertedEntryC.id;

    // update test entry
    response = await request(fastify.server).put(`/update/${idC}`).send(testEntryTwo);

    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty("msg", "Updated successfully");

    // check that entry is updated
    response = await request(fastify.server).get(`/get/${idC}`);

    const insertedEntryTwo = response.body;
    const idTwo = insertedEntryC.id;

    expect(response.statusCode).toEqual(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body.id).toBe(idC);
    expect(response.body).toHaveProperty("title");
    expect(response.body.title).toBe(titleTwo);
    expect(response.body).toHaveProperty("description");
    expect(response.body.description).toBe(descriptionTwo);
    expect(response.body).toHaveProperty("created_at");
    expect(response.body.created_at).toBe(created_atTwo.toISOString());
    expect(response.body).toHaveProperty("scheduled_at");
    expect(response.body.scheduled_at).toBe(scheduled_atTwo.toISOString());

    // check that entry is updated among all entries
    response = await request(fastify.server).get(`/get/`);
    expect(response.statusCode).toEqual(200);
    expect(response.body.length).toEqual(1);
    expect(response.body).not.toContainEqual(insertedEntryC);
    expect(response.body).toContainEqual(insertedEntryTwo);
  });

  // update entry with scheduled date to not have scheduled date
  it("should update entry to have no scheduled date", async () => {
    // create test entry without scheduled date
    let response = await request(fastify.server).post("/create/").send(testEntryOne);
    const insertedEntryOne = response.body;
    const idOne = insertedEntryOne.id;

    // update test entry
    response = await request(fastify.server).put(`/update/${idOne}`).send(testEntryC);

    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty("msg", "Updated successfully");

    // check that entry is updated
    response = await request(fastify.server).get(`/get/${idOne}`);

    const insertedEntryC = response.body;
    const idC = insertedEntryC.id;

    expect(response.statusCode).toEqual(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body.id).toBe(idC);
    expect(response.body).toHaveProperty("title");
    expect(response.body.title).toBe(titleC);
    expect(response.body).toHaveProperty("description");
    expect(response.body.description).toBe(descriptionC);
    expect(response.body).toHaveProperty("created_at");
    expect(response.body.created_at).toBe(created_atC.toISOString());
    expect(response.body).toHaveProperty("scheduled_at");
    expect(response.body.scheduled_at).toBe(null);

    // check that entry is updated among all entries
    response = await request(fastify.server).get(`/get/`);
    expect(response.statusCode).toEqual(200);
    expect(response.body.length).toEqual(1);
    expect(response.body).not.toContainEqual(insertedEntryOne);
    expect(response.body).toContainEqual(insertedEntryC);
  });

  // delete entry
  it("should delete entry", async () => {
    // delete non-existent entry
    let response = await request(fastify.server).delete(`/delete/non-existent`);
    expect(response.status).toEqual(500);
    expect(response.body).toHaveProperty("msg", "Error deleting entry");

    // delete existing test entry
    // create test entry #1
    response = await request(fastify.server).post("/create/").send(testEntryOne);
    const insertedEntryOne = response.body;
    const idOne = insertedEntryOne.id;

    // create test entry #2
    response = await request(fastify.server).post("/create/").send(testEntryOne);
    const insertedEntryTwo = response.body;
    const idTwo = insertedEntryTwo.id;

    // delete test entry #1
    response = await request(fastify.server).delete(`/delete/${idOne}`);

    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty("msg", "Deleted successfully");

    // check that entry #1 is deleted
    response = await request(fastify.server).get(`/get/${idOne}`);

    expect(response.statusCode).toEqual(500);
    expect(response.body).toHaveProperty("msg", `Error finding entry with id ${idOne}`);

    // check that entry #2 still exists
    response = await request(fastify.server).get(`/get/${idTwo}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toMatchObject(insertedEntryTwo);

    // check that entry is deleted from all entries
    response = await request(fastify.server).get(`/get/`);
    expect(response.statusCode).toEqual(200);
    expect(response.body.length).toEqual(1);
    expect(response.body).not.toContainEqual(insertedEntryOne);
    expect(response.body).toContainEqual(insertedEntryTwo);
  });
});
