import {
  Card, CardHeader, CardContent, CardActions, Avatar, Typography, Link
} from "@mui/material";

import TicketStatusChip from "../ticketStatusChip";

import type Message from "../../../types/message.type";

interface MessageCardPropsType {
  ticketStatus?: string;
  message: Message;
  borderColored?: boolean;
  dense?: boolean;
}

const MessageCard = ({ ticketStatus, message, borderColored = false, dense = false }: MessageCardPropsType) => {
  return (
    <>
      {message ? (
        <Card
          sx={{
            width: dense ? 350 : 400,
            border: borderColored ? `2px solid ${message.author.color}` : ``
          }}
        >
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
            action={ticketStatus ? (
              <TicketStatusChip
                status={ticketStatus}
              />
            ) : (
              <></>
            )}
            title={message.author.name}
            subheader={new Date(message.timestamp).toLocaleString()}
          />

          <CardContent
            sx={{
              display: "flex",
              justifyContent: "center",
              padding: dense ? "4px 16px" : "16px"
            }}
          >
            <Typography
              variant={dense ? "caption" : "body2"}
              color="text.secondary"
            >
              {message.content}
            </Typography>
          </CardContent>

          <CardActions
            sx={{ display: "flex", justifyContent: "center", mb: 1 }}
            disableSpacing
          >
            <Link
              sx={{ fontSize: dense ? "12px" : "16px" }}
              href={`https://${message.msg_url.replace("discord://", "")}`}
              target="_blank"
            >
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
