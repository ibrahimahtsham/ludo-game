import { useEffect, useMemo, useRef } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

function ChatBox({ chat = {}, message, onMessageChange, onSend }) {
  const messages = useMemo(() => {
    return Object.entries(chat || {})
      .map(([id, entry]) => ({ id, ...entry }))
      .sort((a, b) => (a.at || 0) - (b.at || 0));
  }, [chat]);

  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages.length]);

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Chat
      </Typography>
      <Box
        sx={{
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 1,
          p: 2,
          minHeight: 160,
          maxHeight: 550,
          overflowY: "auto",
          backgroundColor: "rgba(255,255,255,0.02)",
        }}
        ref={scrollRef}
      >
        {messages.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            No messages yet.
          </Typography>
        )}
        <Stack spacing={1}>
          {messages.map((m) => (
            <Box key={m.id}>
              <Typography variant="caption" color="text.secondary">
                {m.from}
              </Typography>
              <Typography variant="body2">{m.text}</Typography>
            </Box>
          ))}
        </Stack>
      </Box>
      <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
        <TextField
          size="small"
          fullWidth
          placeholder="Type a message"
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
        />
        <Button variant="contained" onClick={onSend}>
          Send
        </Button>
      </Stack>
    </Box>
  );
}

export default ChatBox;
