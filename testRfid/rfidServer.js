import axios from 'axios';


const sendRfid = async (rfid) => {
  console.log(`${rfid} from server`);
  await axios.post(`http://localhost:3000/scan/${rfid}`)
    .then((response) => {
      console.log(response.data);
    });
};

export default sendRfid;
