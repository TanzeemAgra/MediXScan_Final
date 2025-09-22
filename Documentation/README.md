# MedixScan Frontend

A modern, responsive medical clinic and patient management dashboard built with React, Redux Toolkit, and Bootstrap 5.

## 🏥 Features

- **Patient Management Dashboard** - Comprehensive patient records and management
- **Doctor Profiles & Management** - Complete doctor information system  
- **Appointment Scheduling** - Calendar integration with FullCalendar
- **Medical Charts & Analytics** - ApexCharts, Chart.js, and ECharts visualizations
- **Authentication System** - Login, signup, password recovery
- **Responsive Design** - Bootstrap 5 with mobile-first approach
- **Dark/Light Theme** - Theme customization support
- **Email Integration** - Inbox and compose functionality
- **File Management** - Upload and document management
- **Settings & Configuration** - User preferences and system settings

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

3. **Build for Production**
   ```bash
   npm run build
   ```
   Production files will be generated in the `build/` directory

4. **Preview Production Build**
   ```bash
   npm run preview
   ```

## 📦 Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable components
│   ├── layouts/         # Page layouts
│   ├── views/          # Page components
│   │   ├── auth/       # Authentication pages
│   │   ├── dashboard-pages/  # Dashboard components
│   │   ├── doctor/     # Doctor management
│   │   ├── charts/     # Chart components
│   │   └── ...
│   ├── router/         # Routing configuration
│   ├── store/          # Redux store
│   ├── utilities/      # Helper functions
│   └── assets/         # Images, styles
├── package.json
└── vite.config.js
```

## 🛠 Technology Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **State Management**: Redux Toolkit
- **UI Framework**: Bootstrap 5 + React Bootstrap  
- **Charts**: ApexCharts, Chart.js, ECharts
- **Calendar**: FullCalendar
- **Routing**: React Router DOM
- **Styling**: SASS/SCSS
- **Icons**: Remix Icons, FontAwesome, Flaticons

## 🎨 Customization

The template supports extensive customization:
- Theme colors and schemes
- Layout configurations  
- Font families and sizes
- Sidebar styles
- Component variations

## 📱 Responsive Design

Fully responsive design that works seamlessly on:
- Desktop (1200px+)
- Tablet (768px - 1199px)  
- Mobile (320px - 767px)

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build  
- `npm run lint` - Run ESLint
- `npm run serve` - Serve production build on port 3000
- `npm run clean` - Clean build and node_modules

## 📄 License

This is a commercial template. Please ensure you have proper licensing for production use.

## 🤝 Support

For technical support and customization services, please contact the development team.

## Suggestions for a good README

Every project is different, so consider which of these sections apply to yours. The sections used in the template are suggestions for most open source projects. Also keep in mind that while a README can be too long and detailed, too long is better than too short. If you think your README is too long, consider utilizing another form of documentation rather than cutting out information.

## Name
Choose a self-explaining name for your project.

## Description
Let people know what your project can do specifically. Provide context and add a link to any reference visitors might be unfamiliar with. A list of Features or a Background subsection can also be added here. If there are alternatives to your project, this is a good place to list differentiating factors.

## Badges
On some READMEs, you may see small images that convey metadata, such as whether or not all the tests are passing for the project. You can use Shields to add some to your README. Many services also have instructions for adding a badge.

## Visuals
Depending on what you are making, it can be a good idea to include screenshots or even a video (you'll frequently see GIFs rather than actual videos). Tools like ttygif can help, but check out Asciinema for a more sophisticated method.

## Installation
Within a particular ecosystem, there may be a common way of installing things, such as using Yarn, NuGet, or Homebrew. However, consider the possibility that whoever is reading your README is a novice and would like more guidance. Listing specific steps helps remove ambiguity and gets people to using your project as quickly as possible. If it only runs in a specific context like a particular programming language version or operating system or has dependencies that have to be installed manually, also add a Requirements subsection.

## Usage
Use examples liberally, and show the expected output if you can. It's helpful to have inline the smallest example of usage that you can demonstrate, while providing links to more sophisticated examples if they are too long to reasonably include in the README.

## Support
Tell people where they can go to for help. It can be any combination of an issue tracker, a chat room, an email address, etc.

## Roadmap
If you have ideas for releases in the future, it is a good idea to list them in the README.

## Contributing
State if you are open to contributions and what your requirements are for accepting them.

For people who want to make changes to your project, it's helpful to have some documentation on how to get started. Perhaps there is a script that they should run or some environment variables that they need to set. Make these steps explicit. These instructions could also be useful to your future self.

You can also document commands to lint the code or run tests. These steps help to ensure high code quality and reduce the likelihood that the changes inadvertently break something. Having instructions for running tests is especially helpful if it requires external setup, such as starting a Selenium server for testing in a browser.

## Authors and acknowledgment
Show your appreciation to those who have contributed to the project.

## License
For open source projects, say how it is licensed.

## Project status
If you have run out of energy or time for your project, put a note at the top of the README saying that development has slowed down or stopped completely. Someone may choose to fork your project or volunteer to step in as a maintainer or owner, allowing your project to keep going. You can also make an explicit request for maintainers.
