import {
  Card, CardHeader, CardContent, CardActions, Avatar, Typography, Link
} from "@mui/material";

import type Message from "../../../types/message.type";

interface MessageCardPropsType {
  message: Message;
}

const MessageCard = ({ message }: MessageCardPropsType) => {
  return (
    <>
      {message ? (
        <Card sx={{ maxWidth: 300 }}>
          <CardHeader
            avatar={
              <Avatar
                src={message.author.avatar_url}
                sx={{
                  border: `2px solid ${message.author.color}`,
                  borderRadius: "50%",
                }}
              />
            }
            title={message.author.name}
            subheader={new Date(message.timestamp).toLocaleString()}
          />

          <CardContent sx={{ display: "flex", justifyContent: "center" }}>
            <Typography variant="body2" color="text.secondary">
              {message.content}
            </Typography>
          </CardContent>

          <CardActions disableSpacing sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
            <Link href={`https://${message.msg_url.replace("discord://", "")}`} target="_blank">
              View on Discord
            </Link>
          </CardActions>
        </Card>
      ) : (
        <></>
      )}
    </>
  );
}

export default MessageCard;
