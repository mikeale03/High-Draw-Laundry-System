/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/mouse-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { MobileNumber } from 'globalTypes/realm/mobileNumber.types';
import {
  useState,
  ChangeEvent,
  useEffect,
  useRef,
  ComponentProps,
} from 'react';
import { FormControl } from 'react-bootstrap';
import { getMobileNumbers } from 'renderer/service/mobileNumbers';
import { debounce } from 'renderer/utils/helper';

const getSuggestions = debounce(
  (searchText: string) => getMobileNumbers(searchText, 10),
  500
);

export type Props = Omit<ComponentProps<typeof FormControl>, 'onChange'> & {
  onChange: (input: string) => void;
};

function MobileNumberInput({ value, onChange, ...rest }: Props) {
  const [suggestions, setSuggestions] = useState<MobileNumber[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isMouseOver, setIsMouseOver] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const isInputFocusRef = useRef<boolean>(false);

  const handleInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const { value: v } = e.target;
    onChange(v);
    const { isSuccess, result } = await getSuggestions(v);
    if (isSuccess && result) {
      setSuggestions(result);
    }
    setShowSuggestions(true);
  };

  const handleSuggestionSelect = (suggestion: MobileNumber) => {
    inputRef.current?.focus();
    onChange(suggestion.mobile!);
    setShowSuggestions(false);
  };

  const handleKeyPress = () => {};

  const handleOnBlur = () => {
    isInputFocusRef.current = false;
    !isMouseOver && setShowSuggestions(false);
  };

  useEffect(() => {
    async () => {
      const { isSuccess, result } = await getMobileNumbers('');
      if (isSuccess && result) {
        setSuggestions(result);
      }
    };
  }, []);

  return (
    <div
      style={{
        position: 'relative',
      }}
    >
      <FormControl
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={() => {
          setShowSuggestions(true);
          isInputFocusRef.current = true;
        }}
        onBlur={handleOnBlur}
        {...rest}
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul
          className="mt-2"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            border: '1px solid black',
            background: 'white',
            listStyle: 'none',
            padding: 0,
            margin: 0,
          }}
        >
          {suggestions.map((suggestion) => (
            <li
              className="form-control hover-shadow border-0"
              style={{ cursor: 'pointer' }}
              key={suggestion.number}
              onClick={() => handleSuggestionSelect(suggestion)}
              onKeyDown={handleKeyPress}
              onMouseOver={() => setIsMouseOver(true)}
              onMouseLeave={() => {
                setIsMouseOver(false);
                !isInputFocusRef.current && setShowSuggestions(false);
              }}
            >
              {`${suggestion.mobile} - ${suggestion.name}`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MobileNumberInput;
