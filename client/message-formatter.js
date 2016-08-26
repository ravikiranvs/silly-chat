export default function messageFormatter(message){
  let formatterMessage = message;
  
  formatterMessage = formatterMessage.replace('\n', '<br />');

  formatterMessage = emoji(formatterMessage);

  return formatterMessage;
}

function emoji(message){
  return emojione.toImage(message.replace(':)', ':blush:')
      .replace(':(', ':disappointed:')
      .replace(':P', ':stuck_out_tongue_winking_eye:')
      .replace(':D', ':smile:')
      .replace(':*', ':kissing_heart:'));
}