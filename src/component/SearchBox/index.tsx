import * as React from 'react';
import { IoSearchSharp } from 'react-icons/io5';
import './SearchBox.css';

interface SearchBoxProps {
  onTextChanged: (text: string) => void;
}

export default function SearchBox({ onTextChanged }: SearchBoxProps) {
  const [text, setText] = React.useState<string>('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
    onTextChanged(event.target.value);
  };

  return (
    <div className="csSearchBox">
      <IoSearchSharp />
      <input
        value={text}
        onChange={handleChange}
        placeholder="Serach Columns"
      />
    </div>
  );
}
