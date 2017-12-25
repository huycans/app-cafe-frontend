//@flow
import { SERVER_API } from "../../constants/constants.js";
import secureConnect from "./secureConnect";
async function getUserData(
  userId: string,
  sessionToken: string,
  fcmKey: string
): Promise<void> {
  try {
    console.log("getting user data");
    //let userId = await loadData(savedName.userIdFromServer);
    let userData = await secureConnect(
      "GET",
      SERVER_API.userinfo,
      userId,
      sessionToken,
      fcmKey
    );
    return userData.content;
  } catch (error) {
    console.log("get user data error: ", error);
  }
}
export default getUserData;
