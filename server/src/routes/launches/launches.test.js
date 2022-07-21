const request = require('supertest');
const app = require('../../app');
const { mongoConnect, mongoDisconnect } = require('../../services/mongo');

describe('Launches API', () => {

    beforeAll( async () => {
        await mongoConnect();
    });

    afterAll( async () => {
        await mongoDisconnect();
    });

    describe('Test GET /launches', () => {
        test('it should respond with 200 request', async () => {
            const response = await request(app)
                .get('/v1/launches')
                .expect('Content-Type', /json/)
                .expect(200);
        })
    })

    describe('Test POST /launches', () => {

        const launchData = {
            mission: 'USS Enterprise',
            rocket: 'NCC 179-b',
            target: 'Kepler-62 f',
            launchDate: 'January 4, 2028',
        };
        const launchDataWithoutDate = {
            mission: 'USS Enterprise',
            rocket: 'NCC 179-b',
            target: 'Kepler-62 f',
        };

        test('it should respond with 201 request', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(launchData)
                .expect('Content-Type', /json/)
                .expect(201);

            response.body.launchDate = new Date(response.body.launchDate);
            expect(response.body).toMatchObject(Object.assign(
                {
                    launchDate: new Date('January 4, 2028')
                }, launchDataWithoutDate));

        });

        test('it should catch missing required properties', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(launchDataWithoutDate)
                .expect('Content-Type', /json/)
                .expect(400);
            expect(response.body).toStrictEqual({
                error: 'Missing required launch property'
            });
        });

        test('it should catch invalid dates', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(Object.assign(
                    {
                        launchDate: 'Anything But Not Date'
                    }, launchDataWithoutDate))
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body).toStrictEqual({
                error: 'Invalid launch date'
            });

        });
    })
})

