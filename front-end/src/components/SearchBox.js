import React, { useState, useContext, useEffect } from 'react';
import { TextField } from '@mui/material';
import { HouseContext } from './HouseContext';

const SearchBox = () => {
    const { search,  setSearch } = useContext(HouseContext);
    const [ placeholder, setPlaceholder ] = useState('');
    const results = ['Quận 2', 'Vinhome Central Park', 'Quận 7', 'Căn hộ City Garden'];

    useEffect(() => {
        let currentIndex = 0;
        let charIndex = 0; // Track the character index within the current result
        const interval = setInterval(() => {
            const currentResult = results[currentIndex];
            const nextChar = currentResult.charAt(charIndex);
            setPlaceholder(prev => prev + nextChar);
            charIndex++;

            if (charIndex === currentResult.length + 5) {
                currentIndex = (currentIndex + 1) % results.length;
                charIndex = 0; // Reset character index for the next result
                setPlaceholder('');
            }
        }, 170);

        return () => clearInterval(interval);
    }, []);

    return (
        <TextField 
            className='w-[700px]' 
            id="search-text" 
            label="Tìm kiếm" 
            placeholder={placeholder} 
            variant="outlined"
            focused
            value={search}
            onChange={(e) => setSearch(e.target.value)}/>
    )
};

export default SearchBox;