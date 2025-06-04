const courses = [
    {
        subject: 'CSE',
        number: 110,
        title: 'Introduction to Programming',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course will introduce students to programming. It will introduce the building blocks of programming languages (variables, decisions, calculations, loops, array, and input/output) and use them to solve problems.',
        technology: [
            'Python'
        ],
        completed: true
    },
    {
        subject: 'WDD',
        number: 130,
        title: 'Web Fundamentals',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course introduces students to the World Wide Web and to careers in web site design and development. The course is hands on with students actually participating in simple web designs and programming. It is anticipated that students who complete this course will understand the fields of web design and development and will have a good idea if they want to pursue this degree as a major.',
        technology: [
            'HTML',
            'CSS'
        ],
        completed: true
    },
    {
        subject: 'CSE',
        number: 111,
        title: 'Programming with Functions',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'CSE 111 students become more organized, efficient, and powerful computer programmers by learning to research and call functions written by others; to write, call , debug, and test their own functions; and to handle errors within functions. CSE 111 students write programs with functions to solve problems in many disciplines, including business, physical science, human performance, and humanities.',
        technology: [
            'Python'
        ],
        completed: true
    },
    {
        subject: 'CSE',
        number: 210,
        title: 'Programming with Classes',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course will introduce the notion of classes and objects. It will present encapsulation at a conceptual level. It will also work with inheritance and polymorphism.',
        technology: [
            'C#'
        ],
        completed: true
    },
    {
        subject: 'WDD',
        number: 131,
        title: 'Dynamic Web Fundamentals',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course builds on prior experience in Web Fundamentals and programming. Students will learn to create dynamic websites that use JavaScript to respond to events, update content, and create responsive user experiences.',
        technology: [
            'HTML',
            'CSS',
            'JavaScript'
        ],
        completed: true
    },
    {
        subject: 'WDD',
        number: 231,
        title: 'Frontend Web Development I',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course builds on prior experience with Dynamic Web Fundamentals and programming. Students will focus on user experience, accessibility, compliance, performance optimization, and basic API usage.',
        technology: [
            'HTML',
            'CSS',
            'JavaScript'
        ],
        completed: true
    }
];

const courseContainer = document.getElementById('courses-container');
const courseCredits = document.getElementById('total-credits');
const allCoursesButton = document.getElementById('all-courses');
const wddCoursesButton = document.getElementById('wdd-courses');
const cseCoursesButton = document.getElementById('cse-courses');
const courseModal = document.querySelector("#course-details");

let showOption = 'All';

allCoursesButton.addEventListener('click', () => {
    showOption = 'All';
    filterCourses();
});

wddCoursesButton.addEventListener('click', () => {
    showOption = 'WDD';
    filterCourses();
});

cseCoursesButton.addEventListener('click', () => {
    showOption = 'CSE';
    filterCourses();
});

courseModal.addEventListener('click', () => {
    courseModal.close();
});

function filterCourses() {
    courseContainer.innerHTML = '';
    let filteredCourses = courses;
    
    if (showOption !== 'All') {
        filteredCourses = courses.filter(course => course.subject === showOption);
    }
    
    filteredCourses.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.classList.add('course-card');
        
        // Add a class to distinguish completed courses
        if (course.completed) {
            courseCard.classList.add('completed');
        }
        
        courseCard.innerHTML = `
            <h3>${course.title}</h3>
            <p>Completed: ${course.completed ? 'Yes' : 'No'}</p>
            <p>Technology: ${course.technology.join(', ')}</p>
        `;

        // Add a click event listener to display the modal
        courseCard.addEventListener('click', () => {
            displayModal(course);
        });

        courseContainer.appendChild(courseCard);
    });
    
    // Use reduce to calculate total credits as required
    const totalCredits = filteredCourses.reduce((sum, course) => sum + course.credits, 0);
    courseCredits.textContent = totalCredits;
}

function displayModal(course) {
    courseModal.innerHTML = `
        <button id="closeModal">❌</button>
        <h2>${course.subject} ${course.number}</h2>
        <h3>${course.title}</h3>
        <p><strong>Credits</strong>: ${course.credits}</p>
        <p><strong>Certificate</strong>: ${course.certificate}</p>
        <p>${course.description}</p>
        <p><strong>Technologies</strong>: ${course.technology.join(', ')}</p>
    `;
    
    courseModal.showModal();
    
    // Close button functionality
    document.getElementById('closeModal').addEventListener('click', () => {
        courseModal.close();
    });
    
    // Click outside to close
    courseModal.addEventListener('click', (e) => {
        if (e.target === courseModal) {
            courseModal.close();
        }
    });
}

// Initialize the page
filterCourses();