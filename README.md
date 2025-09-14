# Angular Quiz Application

A modern, responsive quiz application built with Angular 20+ and Firebase backend. Features include real-time question management, score tracking, and admin panel for content management.

## 🚀 Features

### User Features
- **Interactive Quiz Interface**: Clean, Material Design-based quiz experience
- **Real-time Scoring**: Instant feedback and score calculation
- **Results Tracking**: View detailed quiz results and performance metrics
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### Admin Features
- **Question Management**: Add, edit, and delete quiz questions
- **Real-time Updates**: Changes reflect immediately across all users
- **Form Validation**: Comprehensive validation for question creation
- **Bulk Operations**: Efficient management of multiple questions

### Technical Features
- **Firebase Integration**: Real-time database with Firestore
- **Angular Signals**: Modern state management with reactive programming
- **Standalone Components**: Latest Angular architecture (no NgModules)
- **Server-Side Rendering**: Enhanced performance and SEO
- **TypeScript**: Full type safety and modern JavaScript features
- **Material Design**: Consistent, accessible UI components

## 🛠️ Tech Stack

- **Frontend**: Angular 20+ (latest)
- **Backend**: Firebase/Firestore
- **UI Library**: Angular Material 
- **State Management**: Angular Signals
- **Styling**: SCSS with Material Theme
- **Build Tool**: Angular CLI
- **Deployment**: GitHub Pages
- **Testing**: Jasmine + Karma

## � Architecture

### Project Structure
```
src/
├── app/
│   ├── components/          # Feature components
│   │   ├── admin/          # Admin panel
│   │   ├── home/           # Landing page
│   │   ├── quiz/           # Quiz interface
│   │   └── results/        # Results display
│   ├── services/           # Business logic services
│   │   ├── firebase.service.ts  # Firebase operations
│   │   └── quiz.service.ts     # Quiz state management
│   ├── types/              # TypeScript interfaces
│   └── config/             # Configuration files
├── environments/           # Environment configurations
└── assets/                # Static resources
```

### Key Components

#### QuizService
- **Purpose**: Centralized state management using Angular Signals
- **Features**: Reactive quiz state, computed properties, Firebase integration
- **Signals**: `currentQuestion`, `score`, `isQuizComplete`, `answers`

#### FirebaseService  
- **Purpose**: Database operations and Firebase integration
- **Methods**: CRUD operations for questions and results
- **Collections**: `questions`, `quiz-results`

#### AdminComponent
- **Purpose**: Question management interface
- **Features**: Reactive forms, real-time updates, validation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Firebase account
- Git

### Installation
```bash
# Clone repository
git clone <repository-url>
cd angular-quiz

# Install dependencies
npm install

# Start development server
npm start
```

Visit `http://localhost:4200/` to view the application.

### Firebase Setup
1. Create Firebase project
2. Enable Firestore
3. Update environment files with your config
4. See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions

## 📱 Usage

### Taking a Quiz
1. Navigate to the home page
2. Click "Start Quiz"
3. Answer questions by selecting options
4. View your results at the end

### Admin Panel
1. Navigate to `/admin`
2. Add new questions using the form
3. Edit existing questions inline
4. Delete questions as needed

### Question Format
```typescript
interface Question {
  id: string | number;
  question: string;
  options: string[];
  correct: number;  // Index of correct answer
}
```

## 🔧 Development

### Available Scripts
```bash
npm start              # Development server
npm run build          # Production build
npm run build:prod     # Optimized production build
npm test               # Run unit tests
npm run deploy:github  # Build and deploy to GitHub Pages
```

### Development Guidelines
- Follow Angular style guide
- Use standalone components (no NgModules)
- Implement reactive patterns with Signals
- Write unit tests for new features
- Use TypeScript strict mode

### Code Quality
- **ESLint**: Linting and code standards
- **Prettier**: Code formatting
- **TypeScript**: Type checking
- **Angular DevKit**: Build optimization

## 🌐 Deployment

### GitHub Pages
```bash
npm run deploy:github
```

### Manual Deployment
```bash
npm run build:prod
npx angular-cli-ghpages --dir=dist/angular-quiz/browser
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive deployment instructions.

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### Test Coverage
```bash
ng test --code-coverage
```

### Testing Strategy
- Component testing with TestBed
- Service testing with dependency injection
- Firebase service mocking for unit tests

## 🔒 Security

### Firebase Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /questions/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Best Practices
- Environment-based configuration
- API key protection
- Input sanitization
- HTTPS enforcement

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Development Standards
- Follow Angular coding standards
- Write meaningful commit messages
- Include unit tests for new features
- Update documentation as needed

## 📊 Performance

### Optimization Features
- Lazy loading for components
- OnPush change detection strategy
- Angular Signals for efficient reactivity
- Tree-shaking for bundle optimization
- Service Worker for caching (future enhancement)

### Metrics
- Lighthouse Score: 90+ (Performance, Accessibility, Best Practices)
- Bundle Size: < 500KB (gzipped)
- First Contentful Paint: < 2s

## 🔮 Future Enhancements

### Planned Features
- [ ] User authentication and profiles
- [ ] Multiple quiz categories
- [ ] Timed quiz mode
- [ ] Question difficulty levels
- [ ] Leaderboard system
- [ ] Question statistics and analytics
- [ ] Mobile app version (Ionic)
- [ ] Offline support with PWA

### Technical Improvements
- [ ] Service Worker implementation
- [ ] Advanced caching strategies
- [ ] Real-time multiplayer quizzes
- [ ] Question import/export functionality
- [ ] Advanced analytics dashboard

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help
- 📖 [Documentation](./DEPLOYMENT.md)
- 🐛 [Report Issues](../../issues)
- 💬 [Discussions](../../discussions)

### Common Issues
- **Build Errors**: Check Node.js version and dependencies
- **Firebase Connection**: Verify API keys and project setup
- **Deployment Issues**: Review GitHub Pages configuration

### Resources
- [Angular Documentation](https://angular.io/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Angular Material](https://material.angular.io/)

## 👏 Acknowledgments

- Angular Team for the amazing framework
- Firebase Team for the backend infrastructure  
- Material Design team for the UI components
- Open source community for inspiration and tools

---

**Built with ❤️ using Angular and Firebase**
