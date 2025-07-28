import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"

export default function Home() {
  return (
    <div className="flex h-screen w-full flex-col gap-y-10">
      <div>
        <Button variant="elevated">Hi there</Button>
      </div>
      <div>
        <Input placeholder="I am" />
      </div>
      <div>
        <Progress value={70} />
      </div>
      <div>
        <Textarea />
      </div>
      <div>
        <Checkbox defaultChecked />
      </div>
    </div>
  )
}
