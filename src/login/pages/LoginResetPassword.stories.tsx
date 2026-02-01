import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "login-reset-password.ftl" });

const meta = {
    title: "login/LoginResetPassword",
    component: KcPageStory
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => <KcPageStory />
};

export const WithAttemptedUsername: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                auth: {
                    attemptedUsername: "user@example.com"
                }
            }}
        />
    )
};
