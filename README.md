# Blue Alliance Scraper

This project will be used for:

-   Building event match schedule and saving to firebase
-   Getting us a list of robots that don't have images at event and saving them to firebase

## Project Environments Setup

1. Copy `.env.example` and rename it to `.env`
2. Add your values for the environment variables

**DON'T COMMIT `.env` INTO THE PROJECT OR ELSE EVERYONE VIEWING WILL BE ABLE TO USE YOUR API KEY!**

## Firestore Setup

1. Go to your firebase project and go to settings
2. Go to service accounts and click `Generate new private key`
3. Rename the file to `firebase-service-account.json`

**DON'T EVER COMMIT `firebase-service-account.json` OR ELSE EVERYONE WHO VIEWS THE PROJECT WILL HAVE ACCOUNT TO YOUR FIREBASE DATABASE AND EVERYTHING ELSE!**

## LICENSE

Copyright (c) 2020 Team 2852

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
