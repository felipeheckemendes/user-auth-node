import GitHubIcon from '@/assets/github-black.svg'; // Adjust the path as needed
import LinkedInIcon from '@/assets/linkedin-black.svg'; // Adjust the path as needed
import DiscordIcon from '@/assets/discord-black.svg'; // Adjust the path as needed

export default function Contact() {
  return (
    <div className="flex flex-col items-center pt-16 space-y-8">
      <div className="w-full space-y-4 text-left">
        <p className="font-tinos text-5xl">Let's Connect!</p>
        <p className="">I'm excited to connect with others who share a passion for tech.</p>
        <p className="">Feel free to reach out through any of the platforms below!</p>
      </div>
      <div className="w-11/12 space-y-4">
        <a
          className="text-indigo-500 hover:underline flex items-center justify-left"
          href="https://github.com/felipeheckemendes"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={GitHubIcon} alt="GitHub" className="w-6 h-6 mr-2" />
          My GitHub Profile
        </a>
        <a
          className="text-indigo-500 hover:underline flex items-center justify-left"
          href="https://github.com/felipeheckemendes/user-auth-node"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={GitHubIcon} alt="GitHub" className="w-6 h-6 mr-2" />
          This Project's GitHub Repository
        </a>
        <a
          className="text-indigo-500 hover:underline flex items-center justify-left"
          href="#"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={LinkedInIcon} alt="LinkedIn" className="w-6 h-6 mr-2" />
          My LinkedIn Profile
        </a>
        <a
          className="text-indigo-500 hover:underline flex items-center justify-left"
          href="https://discordapp.com/users/1205582180886118461"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={DiscordIcon} alt="LinkedIn" className="w-6 h-6 mr-2" />
          Contact me on Discord
        </a>
      </div>
    </div>
  );
}
