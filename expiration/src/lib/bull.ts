import Bull from "bull";
import groupQueueName from "../events/group-name";
const bull = new Bull(groupQueueName, {
  redis: {
    host: process.env!.REDIS_HOST,
    port: Number(process.env!.REDIS_PORT),
  },
});

export default bull;
