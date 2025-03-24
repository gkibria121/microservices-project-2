import axios from "axios";
import https from "https";
import mongoose from "mongoose";
const BASE_URL = "https://ticksell.dev";
const instance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false, // Ignore SSL certificate errors
  }),
});
const createTicket = async (no: number) => {
  try {
    const ticketAttr = { title: "Ticket " + no, price: 100 };
    const { data } = await instance.post(
      `${BASE_URL}/api/tickets/create`,
      ticketAttr,
      {
        headers: {
          Cookie:
            "session=eyJqd3QiOiJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKbGJXRnBiQ0k2SW1kcmFXSnlhV0ZrWkdSa1pHUXhaR1J6TWpFeU1XUmtNa0JuYldGcGJDNWpiMjBpTENKcFpDSTZJalkzWlRFMU9HRTNNREl6T1RFMU1UUXhOV1ZoWldRek5pSXNJbWxoZENJNk1UYzBNamd5TVRVME5YMC54VXBYLWp1V1M1R2FtNG5RTml3NTk1Y0dSUFZZX1RWOEdfdy1OakpaRFQ0In0=; Path=/; Secure; HttpOnly; Expires=Mon, 24 Mar 2025 13:29:45 GMT;",
        },
      }
    );

    return data.data;
  } catch (e: any) {
    console.log(e.message);
  }
};
const updateTicket = async (
  id: mongoose.Schema.Types.ObjectId,
  title: string,
  price: number
) => {
  try {
    const ticketAttr = { title, price };
    const { data } = await instance.put(
      `${BASE_URL}/api/tickets/${id}`,
      ticketAttr,
      {
        headers: {
          Cookie:
            "session=eyJqd3QiOiJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKbGJXRnBiQ0k2SW1kcmFXSnlhV0ZrWkdSa1pHUXhaR1J6TWpFeU1XUmtNa0JuYldGcGJDNWpiMjBpTENKcFpDSTZJalkzWlRFMU9HRTNNREl6T1RFMU1UUXhOV1ZoWldRek5pSXNJbWxoZENJNk1UYzBNamd5TVRVME5YMC54VXBYLWp1V1M1R2FtNG5RTml3NTk1Y0dSUFZZX1RWOEdfdy1OakpaRFQ0In0=; Path=/; Secure; HttpOnly; Expires=Mon, 24 Mar 2025 13:29:45 GMT;",
        },
      }
    );

    return data.data;
  } catch (e: any) {
    console.log(e.message);
  }
};
const seed = async (no: number) => {
  const ticket = await createTicket(no);
  await updateTicket(ticket._id, ticket.title, 10);
  await updateTicket(ticket._id, ticket.title, 20);
};

for (let index = 0; index < 1000; index++) {
  seed(index);
}
