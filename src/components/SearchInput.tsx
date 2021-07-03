import React, { useState, useMemo } from 'react'
import { Input } from '@heswap/uikit'
import styled from 'styled-components'
import debounce from 'lodash/debounce'
import { useTranslation } from 'contexts/Localization'

const StyledInput = styled(Input)`
  background-color: rgb(2, 17, 39);
  border-radius: 8px;
  border: 1px solid rgb(28, 50, 84);
  color: rgb(112, 141, 183);
  font-size: 12px;
  height: 40px;
  outline: none;
  padding: 0 16px;
  width: 100%;
  margin-left: auto;

  &:focus:not(:disabled) {
    box-shadow: none;
    border: 1px solid rgb(18, 99, 241);
  }
`

const InputWrapper = styled.div`
  position: relative;
  ${({ theme }) => theme.mediaQueries.sm} {
    display: block;
  }
`

const Container = styled.div<{ toggled: boolean }>``

interface Props {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
}

const SearchInput: React.FC<Props> = ({ onChange: onChangeCallback, placeholder = 'Search' }) => {
  const [toggled, setToggled] = useState(false)
  const [searchText, setSearchText] = useState('')

  const { t } = useTranslation()

  const debouncedOnChange = useMemo(
    () => debounce((e: React.ChangeEvent<HTMLInputElement>) => onChangeCallback(e), 500),
    [onChangeCallback],
  )

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
    debouncedOnChange(e)
  }

  return (
    <Container toggled={toggled}>
      <InputWrapper>
        <StyledInput
          value={searchText}
          onChange={onChange}
          placeholder={t(placeholder)}
          onBlur={() => setToggled(false)}
        />
      </InputWrapper>
    </Container>
  )
}

export default SearchInput
