require('dotenv').config();
const inquirer = require('inquirer');
const request = require('request-promise-native');
const db = require('./firestore-db');

const apiKey = process.env.BLUE_ALLIANCE_API_KEY;
const apiVersionUrl = process.env.API_URL;

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
    } catch (e) { }

    return null;
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

    const eventMatchesURL = apiVersionUrl + '/event/' + cliQuestions.eventKey + '/teams/keys';
    const response = await request.get(eventMatchesURL, { headers: { 'X-TBA-Auth-Key': apiKey } });
    const teamKeys = JSON.parse(response);

    const eventDoc = await db
        .collection('events')
        .doc(cliQuestions.eventKey)

    const robotMediaList = await Promise.all(teamKeys.map(async teamKey => {
        const robotMediaUrl = apiVersionUrl + '/team/' + teamKey + '/media/' + cliQuestions.year;

        const robotMediaResponse = await request.get(robotMediaUrl, { headers: { 'X-TBA-Auth-Key': apiKey } });
        const robotPhotoUrls = getRobotImages(robotMediaResponse);

        return { teamKey, photos: robotPhotoUrls };
    }));

    const needRobotPhotos = robotMediaList
        .filter(robotMedia => robotMedia.photos === null)
        .map(robotMedia => robotMedia.teamKey);

    await eventDoc.set({ needRobotPhotos }, { merge: true });

    const robotCollection = await db
        .collection('robots');

    const robotDocs = robotMediaList.map(robotMedia => {
        return robotCollection.doc(robotMedia.teamKey).set({ photos: robotMedia.photos }, { merge: true });
    });

    await Promise.all(robotDocs);
};

run();
