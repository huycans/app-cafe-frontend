//@flow
import { URL } from "../../constants/constants.js";

import sha512 from "crypto-js/sha512";
async function secureConnect(
  method: string,
  api: string,
  userId: string,
  sessionToken: string,
  fcmKey: string
): Promise<any> {
  try {
    console.log("starting getting user data");
    let currentTime = new Date().toISOString();
    //Hashing.sha512().hashString("GET /user/info/$userId $currentTime $fcmKey", Charsets.UTF_8).toString()
    let hashDigest = sha512(
      `${method} ${api}/${userId} ${currentTime} ${fcmKey}`
    ).toString();
    console.log("hash digest: ", hashDigest);
    let link = `${URL}${api}/${userId}?emit=${currentTime}`;
    let serverResponse = await fetch(link, {
      method: method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        sessionToken: sessionToken,
        enc: hashDigest
      }
    });
    console.log("secure connect serverResponse: ", serverResponse);
    let responseJSON = await serverResponse.json();
    console.log("secure connect responseJSON: ", responseJSON);
    if (responseJSON.status.httpStatus === 200) {
      //make sure there is content inside the response before return it to signin function
      return responseJSON;
    } else {
      console.log(responseJSON.message);
      throw responseJSON.message;
    }
  } catch (error) {
    console.log("Error when securely connect to server: ", error);
  }
}
export default secureConnect;
