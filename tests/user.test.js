import request from "supertest";
import "regenerator-runtime/runtime"
import app from "../src/app";
import { async } from "regenerator-runtime/runtime";
import User from '../src/models/User'




beforeEach(async () => {
    await User.deleteMany()
})


test('It should register an account', async () => {
    await request(app).post("/auth/register").send({
        email: "bob@something",
        password: "bob123",
        firstName: "Mike",
        lastName: "Tyson",
        address: "11 rue de la republique",
        c_address: "1er etage",
        city: "Paris",
        zipcode: "75013",
        phone: "0789854123",
        acc_type: "client",
        birth_date: "Paris",
        longitude: "123",
        latitude: "32",
    }).expect(201)
})
test('It should try to login the user resgistred without account confirmed', async (done) => {
    const client_user = {
        email: "bobx@something",
        password: "bob12345",
        firstName: "Mike",
        lastName: "Tyson",
        address: "11 rue de la republique",
        c_address: "1er etage",
        city: "Paris",
        zipcode: "75013",
        phone: "0789854123",
        acc_type: "client",
        birth_date: "Paris",
        longitude: "123",
        latitude: "32",
    }
    const isValidJSON = (res) => {
        res.body.should.have.property("msg", "Account not active");
    };
    await request(app).post("/auth/register").send(client_user).expect(201)
    await request(app).post("/auth/login").send({
        "email": "bobx@something",
        "password": "bob12345",
    })
        .expect(res => {
            expect(res.status).toBe(200)
            const { msg } = res.body
            expect(msg).toBe("Account not active")
            done()
        })

})
test('It should deny the authentication if the password is incorrect', async () => {
    const client_user = {
        email: "bobx@something",
        password: "bob12345",
        firstName: "Mike",
        lastName: "Tyson",
        address: "11 rue de la republique",
        c_address: "1er etage",
        city: "Paris",
        zipcode: "75013",
        phone: "0789854123",
        acc_type: "client",
        birth_date: "Paris",
        longitude: "123",
        latitude: "32",
    }
    await request(app).post("/auth/register").send(client_user).expect(201)
    await request(app).post("/auth/login").send({
        "email": "bobx@something",
        "password": "bobxxxxx",
    }).expect(401)
})


