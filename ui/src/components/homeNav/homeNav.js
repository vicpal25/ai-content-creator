import * as React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';

const buttons = [
  <Button key="ai-categories" href='/categories'>AI Categories</Button>,
  <Button key="ai-chatbot">AI Chatbot</Button>,
];

export default function HomeNav() {
  return (
    <Box className="box">
      <ButtonGroup
         fullWidth="true"
        orientation="vertical"
        aria-label="Vertical button group"
        variant="contained"
      >
        {buttons}
      </ButtonGroup>
      <style jsx>{`
        .box {
            border: 1px solid #eaeaea;
            padding: 15px 40px;
            text-align: center;
        }
      `}
      </style>

    </Box>
  );
}