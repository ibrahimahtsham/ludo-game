import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

function CreateJoinPanel({
  username,
  roomCodeInput,
  onRoomCodeChange,
  onCreate,
  onJoin,
}) {
  const canJoin = username.trim() && roomCodeInput.trim().length === 6;
  const canCreate = Boolean(username.trim());

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={1}
      alignItems="center"
    >
      <Button
        variant="contained"
        onClick={onCreate}
        disabled={!canCreate}
        fullWidth
      >
        Create Game
      </Button>
      <TextField
        label="Room Code"
        value={roomCodeInput}
        onChange={(e) =>
          onRoomCodeChange(e.target.value.replace(/\D/g, "").slice(0, 6))
        }
        inputProps={{ maxLength: 6 }}
        fullWidth
      />
      <Button variant="outlined" onClick={onJoin} disabled={!canJoin} fullWidth>
        Join
      </Button>
    </Stack>
  );
}

export default CreateJoinPanel;
