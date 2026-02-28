import { EyeClosedIcon, EyeIcon } from "lucide-react"
import { type ComponentPropsWithoutRef, useState } from "react"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/app/components/ui/input-group"

type PasswordInputProps = ComponentPropsWithoutRef<typeof InputGroupInput>

const PasswordInput = ({ ...props }: PasswordInputProps) => {
  const [passwordVisible, setPasswordVisible] = useState(false)

  return (
    <InputGroup>
      <InputGroupInput {...props} type={passwordVisible ? "text" : "password"} />
      <InputGroupAddon align="inline-end">
        <InputGroupButton
          aria-label={passwordVisible ? "Hide password" : "Show password"}
          title={passwordVisible ? "Hide password" : "Show password"}
          size="icon-xs"
          onClick={() => {
            setPasswordVisible((visible) => !visible)
          }}
        >
          {passwordVisible ? <EyeIcon /> : <EyeClosedIcon />}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}

export default PasswordInput
