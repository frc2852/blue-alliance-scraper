require('dotenv').config();
const inquirer = require('inquirer');
const request = require('request-promise-native');
const db = require('./firestore-db');

const apiKey = process.env.BLUE_ALLIANCE_API_KEY;
const apiVersionUrl = process.env.API_URL;

const noImagesForBots = [];

const getRobotImages = robotResponse => {
    try {
        const robotMetadataList = JSON.parse(robotResponse);

        const imageMetadataUrls = robotMetadataList.filter(robotMetadata => {
            if (robotMetadata.direct_url && robotMetadata.direct_url.length > 0) {
                return true;
            }

            return false;
        });

        if (imageMetadataUrls.length > 0) {
            return imageMetadataUrls.map(imageMetadataUrl => {
                return imageMetadataUrl.direct_url;
            });
        }
    } catch (e) {}

    return null;
};

const buildRobotForMatch = async (teamKey, cliQuestions) => {
    const robotUrl = apiVersionUrl + '/team/' + teamKey + '/media/' + cliQuestions.year;

    try {
        const robotResponse = await request.get(robotUrl, { headers: { 'X-TBA-Auth-Key': apiKey } });

        const robotImages = getRobotImages(robotResponse);

        if (robotImages === null) {
            noImagesForBots.push(teamKey);
        }

        return {
            teamKey,
            imageUrls: robotImages,
        };
    } catch (e) {
        console.log('failed on url', robotUrl, e);
    }
};

const run = async () => {
    const cliQuestions = await inquirer.prompt([
        {
            name: 'eventKey',
            message: 'Enter the event key:',
            default: process.env.EVENT_KEY,
        },
        {
            name: 'year',
            message: 'Enter year for robot images:',
            default: process.env.YEAR,
        },
    ]);

    const eventMatchesURL = apiVersionUrl + '/event/' + cliQuestions.eventKey + '/matches';
    const response = await request.get(eventMatchesURL, { headers: { 'X-TBA-Auth-Key': apiKey } });
    const eventMatches = JSON.parse(response);

    const collectionMatches = await db
        .collection('events')
        .doc(cliQuestions.eventKey)
        .collection('matches');

    const docMatches = eventMatches.map(async match => {
        const matchDoc = await collectionMatches.doc(match.key);

        const redBots = match.alliances.red.team_keys;
        const blueBots = match.alliances.blue.team_keys;

        const redTeam = await Promise.all(redBots.map(teamKey => buildRobotForMatch(teamKey, cliQuestions)));
        const blueTeam = await Promise.all(blueBots.map(teamKey => buildRobotForMatch(teamKey, cliQuestions)));

        const matchObj = {
            redTeam,
            blueTeam,
        };

        return matchDoc.set(matchObj);
    });

    await Promise.all(docMatches);

    const eventDoc = await db.collection('events').doc(cliQuestions.eventKey);

    const needRobotImages = noImagesForBots.filter((noImagesForBot, index) => {
        return noImagesForBots.indexOf(noImagesForBot) === index;
    });

    eventDoc.set({ needRobotImages }, { merge: true });
};

run();
