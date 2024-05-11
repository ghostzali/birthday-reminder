import axios from "axios";
import { email } from "../config";

type SendEmailResponse = {
  status: string;
  sentTime: Date;
};

export class EmailService {
  protected serviceUrl: string;

  constructor() {
    this.serviceUrl = email.serviceUrl;
  }

  async sendTextEmail(to: string, message: string): Promise<Date | null> {
    try {
      const res = await axios.post(
        this.serviceUrl,
        { email: to, message },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      if (res.status !== 200) throw new Error(res.statusText);

      const data: SendEmailResponse = res.data;
      if (data.status === "sent") return data.sentTime;

      return null;
    } catch (error) {
      throw error;
    }
  }
}
