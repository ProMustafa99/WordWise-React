import React from 'react';
import Button  from './Button';
import { useNavigate } from "react-router-dom";

export default function BackButton() {
    const navigat = useNavigate();
    return (
        <Button type='back' onClick={(e) => {
            e.preventDefault();
            navigat(-1);

        }} >&larr; Back</Button>
    );
}
