import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { isActivePath } from "../../../resources/functions";
import { IoArrowBack } from "react-icons/io5";

const ProfileSidebarOption = [
  {
    id: 1,
    label: "General Settings",
    value: "general-settings",
  },
  {
    id: 2,
    label: "Chat Settings",
    value: "chat-settings",
  },
  {
    id: 3,
    label: "Email Address",
    value: "email-address",
  },
  {
    id: 4,
    label: "Change Password",
    value: "change-password",
  },
  {
    id: 5,
    label: "Manage Sessions",
    value: "manage-sessions",
  },
  {
    id: 6,
    label: "Invite a friend",
    value: "invite-friend",
  },
];

const ProfileSidebar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  return (
    <div className="w-3/12 min-w-80 bg-white border-customBlue flex flex-col m-4 rounded-xl">
      <div className="p-4 cursor-pointer max-w-fit" onClick={() => navigate("/home")}>
        <IoArrowBack />
      </div>
      {ProfileSidebarOption.map((_) => {
        return (
          <div
            key={_.id}
            className={`py-5 px-4 hover:bg-grey ${
              isActivePath({ order: "1", pathname, path: _.value }) ? "bg-grey" : ""
            } justify-between flex gap-2 cursor-pointer`}
            onClick={() => {
              navigate(`/profile/${_.value}`);
            }}>
            {_.label}
          </div>
        );
      })}
    </div>
  );
};

export default ProfileSidebar;

// Essential Settings
// User Profile Settings

// Username
// Profile picture
// Status message
// Last seen visibility
// Chat Settings

// Chat background
// Font size and style
// Notification settings (browser notifications, sound, etc.)
// Privacy Settings

// Block/unblock users
// Read receipts (enable/disable)
// Typing indicators (show/hide)
// Last seen (visible to everyone, contacts, or nobody)
// Security Settings

// Two-factor authentication (2FA)
// End-to-end encryption
// Backup and restore chat history
// Notification Settings

// Message notifications (on/off)
// Group notifications (on/off)
// Custom notification tones
// Mute specific chats or groups
// Advanced Settings
// Appearance and Theme

// Light/dark mode
// Custom themes
// Chat bubble colors
// Data and Storage Usage

// Manage media auto-download (Wi-Fi, cellular, never)
// Storage usage summary
// Clear chat history
// Language and Localization

// App language
// Regional date and time formats
// Media and Files Settings

// Media compression settings (high, medium, low)
// Automatic download settings for images, videos, documents
// Group Chat Settings

// Group name and icon
// Add/remove participants
// Group admin privileges
// Group description
// Backup Settings

// Cloud backup options (frequency, network type)
// Local backup options
// Accessibility Settings

// Text-to-speech
// High-contrast mode
// Larger text
// Developer Settings (for advanced users)

// API access (for integrations)
// Debug mode
// Log export
// Additional Features
// Voice and Video Call Settings

// Call quality settings (auto, low, high)
// Call notifications
// Security and Privacy Enhancements

// Fingerprint/Face ID lock
// Self-destructing messages
// Hidden chats
// Integration Settings

// Integration with other apps (calendar, file storage, etc.)
// Bot settings (for automated responses, customer service)
// Custom Emojis and Stickers

// Upload custom emojis
// Sticker packs
// Web-Specific Settings
// Browser Notifications

// Enable/disable desktop notifications
// Customize notification sounds
// Shortcut Settings

// Keyboard shortcuts for quick actions
// Customizable shortcuts
// Tab and Window Management

// Multiple chat tabs
// Pop-out chat windows
// Session Management

// Manage active sessions (logged-in devices)
// Remote logout options
// Responsive Design Settings

// Layout options for different screen sizes
// Mobile view settings
// By offering these settings, you can provide a flexible and user-friendly experience for users of your chat app website.
