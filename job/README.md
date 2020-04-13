# Webhook Slack Bot

This project is a web service for scheduling slack messages using [Incoming Webhooks](https://api.slack.com/messaging/webhooks) and Google's [Cloud Tasks](https://cloud.google.com/tasks) and [Cloud Functions](https://cloud.google.com/functions).

## Installing

**Create project in Google Cloud**
1. Create a new Cloud project in the [Cloud Console](https://console.cloud.google.com/projectcreate?_ga=2.28855545.494925480.1586812905-74932976.1549378438)

2. Enter a name for your Cloud project and click Create.

3. Remember the project ID, shown under the Project name field. The project ID is important because it is used to identify your project to the Google Cloud tools.

4. Enable billing for your project.

**Enable Cloud Functions and Cloud Tasks API**
1. Make sure that billing is enabled for your Google Cloud project.
2. Enable [Cloud Functions API](https://console.cloud.google.com/flows/enableapi?apiid=cloudfunctions&redirect=https://cloud.google.com/functions/docs/quickstart-nodejs&_ga=2.2755701.494925480.1586812905-74932976.1549378438)
3. Enable [Cloud Tasks API](https://console.cloud.google.com/apis/api/cloudtasks.googleapis.com/overview)

**Download service account key**
1. Go to [Service accounts](https://console.cloud.google.com/iam-admin/serviceaccounts?project=kobe-projects) page

2. Click on the service account with `Cloud Tasks Service Agent` role granted

3. Click **Edit**

4. Then click **Generate key**

5. Download the json key and store it in a safe place in your computer.

6. Setup the `GOOGLE_APPLICATION_CREDENTIALS` enviroment variable with the json you just downloaded:
```shell
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json
```

**GCloud CLI**
1. Download and install `gcloud` as specified in the [docs](https://cloud.google.com/sdk/docs#install_the_latest_cloud_tools_version_cloudsdk_current_version)

**Deploy**

```shell
gcloud functions deploy slack-bot --runtime nodejs10 --trigger-http --entry-point app
```

**Create tasks queue** 

```shell
gcloud tasks queues create slack-bot
```

Now you are go to go!