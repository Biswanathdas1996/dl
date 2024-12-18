import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";

interface BasicGridProps {
  welcomeCompontent: any;
  userStory: any;
  testCase: any;
  testData: any;
  codeData: any;
  referance: any;
  taskId: any;
  userQuery: any;
}

export default function BasicGrid({
  welcomeCompontent,
  userStory,
  testCase,
  testData,
  codeData,
  referance,
  taskId,
  userQuery,
}: BasicGridProps) {
  return (
    <Box sx={{ flexGrow: 1 }} style={{ fontSize: 11 }}>
      <Grid container spacing={2}>
        <Grid size={12}>{userQuery()}</Grid>
        {!taskId && <Grid size={12}>{referance()}</Grid>}
        <Grid size={taskId ? 8 : 12}>{userStory()}</Grid>
        {taskId && <Grid size={4}>{referance()}</Grid>}
        <Grid size={taskId ? 7 : 12}>{testCase()}</Grid>
        <Grid size={taskId ? 5 : 12}>{testData()}</Grid>
        <Grid size={12}>{codeData()}</Grid>
      </Grid>
    </Box>
  );
}
