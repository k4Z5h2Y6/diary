import { Box, Button, Container, Divider } from "@mui/material";

export default function Setting() {
  return (
    <>
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Divider>設定</Divider>
        <form action="/auth/signout" method="post">
          <Button
            variant="contained"
            type="submit"
            fullWidth
            sx={{ marginBottom: "16px" }}
          >
            サインアウト
          </Button>
        </form>
      </Container>
    </>
  );
}
