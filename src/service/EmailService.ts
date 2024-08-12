import SparkPost from "sparkpost";
const client: SparkPost = new SparkPost(process.env.SPARKPOST_API_KEY);
// If you have a SparkPost EU account you will need to pass a different `origin` via the options parameter:
// const euClient = new SparkPost('<YOUR API KEY>', { origin: 'https://api.eu.sparkpost.com:443' });

export function sendEmail(sender: string, recipient: string, message: string): void {
    client.transmissions.send({
        options: {
            sandbox: true
        },
        content: {
            from: sender,
            subject: 'Testing',
            text: message
        },
        recipients: [
            {address: recipient}
        ]
    })
        .then(data => {
            console.log('Woohoo! You just sent your first mailing!');
            console.log(data);
        })
        .catch(err => {
            console.log('Whoops! Something went wrong');
            console.log(err);
        });
}