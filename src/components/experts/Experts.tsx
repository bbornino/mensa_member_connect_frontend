import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardBody,
  Row,
  Col,
  Button,
  Spinner,
  Alert,
  Input,
  Label,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";

interface Expert {
  id: number;
  user: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    city: string;
    state: string;
  };
  occupation: string;
  industry: {
    id: number;
    industry_name: string;
  } | null;
  background: string;
  availability_status: string;
  show_contact_info: boolean;
  photo?: string;
  expertise?: {
    what_offering: string;
    who_would_benefit: string;
    why_choose_you: string;
    skills_not_offered: string;
  }[];
}

type SortOption = 'name' | 'location' | 'occupation' | 'industry';

const Experts: React.FC = () => {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [filteredExperts, setFilteredExperts] = useState<Expert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [industryFilter, setIndustryFilter] = useState<string>("");
  const [locationFilter, setLocationFilter] = useState<string>("");
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  
  // Dropdown states
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [industryDropdownOpen, setIndustryDropdownOpen] = useState(false);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);

  // Demo data for testing UI
  const demoExperts: Expert[] = [
    {
      id: 1,
      user: {
        id: 1,
        username: "john_doe",
        first_name: "John",
        last_name: "Doe",
        city: "New York",
        state: "NY"
      },
      occupation: "Software Engineer",
      industry: { id: 1, industry_name: "Technology" },
      background: "Senior software engineer with 10+ years of experience in full-stack development, specializing in React, Python, and cloud technologies.",
      availability_status: "available",
      show_contact_info: true,
      photo: "/test-photos/1.png",
      expertise: [{
        what_offering: "Software development mentorship and career guidance",
        who_would_benefit: "Junior developers, career changers, and students",
        why_choose_you: "I have successfully mentored 20+ developers and helped them land their dream jobs.",
        skills_not_offered: "Hardware engineering, game development"
      }]
    },
    {
      id: 2,
      user: {
        id: 2,
        username: "jane_smith",
        first_name: "Jane",
        last_name: "Smith",
        city: "Los Angeles",
        state: "CA"
      },
      occupation: "Data Scientist",
      industry: { id: 2, industry_name: "Technology" },
      background: "Data scientist with expertise in machine learning, statistical analysis, and big data technologies.",
      availability_status: "available",
      show_contact_info: true,
      photo: "/test-photos/2.png",
      expertise: [{
        what_offering: "Data science mentorship and ML project guidance",
        who_would_benefit: "Aspiring data scientists and ML engineers",
        why_choose_you: "I have 8+ years of experience in data science and have published research papers.",
        skills_not_offered: "Web development, mobile app development"
      }]
    },
    {
      id: 3,
      user: {
        id: 3,
        username: "mike_wilson",
        first_name: "Mike",
        last_name: "Wilson",
        city: "Chicago",
        state: "IL"
      },
      occupation: "Marketing Director",
      industry: { id: 3, industry_name: "Marketing" },
      background: "Marketing professional with 15+ years of experience in digital marketing, brand strategy, and campaign management.",
      availability_status: "not_available",
      show_contact_info: false,
      photo: "/test-photos/3.png",
      expertise: [{
        what_offering: "Marketing strategy and digital marketing guidance",
        who_would_benefit: "Small business owners and marketing professionals",
        why_choose_you: "I have helped 50+ businesses grow their online presence and increase sales.",
        skills_not_offered: "Technical development, graphic design"
      }]
    },
    {
      id: 4,
      user: {
        id: 4,
        username: "sarah_johnson",
        first_name: "Sarah",
        last_name: "Johnson",
        city: "Boston",
        state: "MA"
      },
      occupation: "Financial Advisor",
      industry: { id: 4, industry_name: "Finance" },
      background: "Certified financial advisor with expertise in investment planning, retirement planning, and wealth management.",
      availability_status: "available",
      show_contact_info: true,
      photo: "/test-photos/4.png",
      expertise: [{
        what_offering: "Financial planning and investment advice",
        who_would_benefit: "Individuals and families planning for retirement",
        why_choose_you: "I have helped clients grow their wealth by 200% on average over 10 years.",
        skills_not_offered: "Tax preparation, legal advice"
      }]
    },
    {
      id: 5,
      user: {
        id: 5,
        username: "david_brown",
        first_name: "David",
        last_name: "Brown",
        city: "Seattle",
        state: "WA"
      },
      occupation: "UX Designer",
      industry: { id: 5, industry_name: "Design" },
      background: "UX/UI designer with 8+ years of experience creating user-centered digital experiences for startups and enterprises.",
      availability_status: "available",
      show_contact_info: true,
      photo: "/test-photos/5.png",
      expertise: [{
        what_offering: "UX/UI design mentorship and portfolio review",
        who_would_benefit: "Aspiring designers and product managers",
        why_choose_you: "I have designed products used by millions of users and won design awards.",
        skills_not_offered: "Frontend development, graphic design"
      }]
    },
    {
      id: 6,
      user: {
        id: 6,
        username: "lisa_garcia",
        first_name: "Lisa",
        last_name: "Garcia",
        city: "New York",
        state: "NY"
      },
      occupation: "Product Manager",
      industry: { id: 1, industry_name: "Technology" },
      background: "Product manager with 12+ years of experience leading cross-functional teams and launching successful products.",
      availability_status: "available",
      show_contact_info: true,
      photo: "/test-photos/6.png",
      expertise: [{
        what_offering: "Product management mentorship and career guidance",
        who_would_benefit: "Aspiring product managers and business analysts",
        why_choose_you: "I have launched 10+ successful products and mentored 30+ PMs in their careers.",
        skills_not_offered: "Technical development, marketing strategy"
      }]
    },
    {
      id: 7,
      user: {
        id: 7,
        username: "alex_chen",
        first_name: "Alex",
        last_name: "Chen",
        city: "San Francisco",
        state: "CA"
      },
      occupation: "DevOps Engineer",
      industry: { id: 1, industry_name: "Technology" },
      background: "DevOps engineer specializing in cloud infrastructure, CI/CD pipelines, and automation. Expert in AWS, Docker, and Kubernetes.",
      availability_status: "available",
      show_contact_info: true,
      photo: "/test-photos/1.png",
      expertise: [{
        what_offering: "DevOps and cloud infrastructure mentorship",
        who_would_benefit: "Software engineers transitioning to DevOps and cloud computing",
        why_choose_you: "I have helped 15+ engineers successfully transition to DevOps roles and scale infrastructure for startups.",
        skills_not_offered: "Frontend development, mobile app development"
      }]
    },
    {
      id: 8,
      user: {
        id: 8,
        username: "maria_rodriguez",
        first_name: "Maria",
        last_name: "Rodriguez",
        city: "Miami",
        state: "FL"
      },
      occupation: "Marketing Consultant",
      industry: { id: 3, industry_name: "Marketing" },
      background: "Marketing consultant with expertise in digital marketing, social media strategy, and brand development for small businesses.",
      availability_status: "available",
      show_contact_info: true,
      photo: "/test-photos/2.png",
      expertise: [{
        what_offering: "Digital marketing strategy and social media guidance",
        who_would_benefit: "Small business owners and marketing professionals",
        why_choose_you: "I have helped 40+ small businesses increase their online presence and grow their customer base.",
        skills_not_offered: "Technical development, graphic design"
      }]
    },
    {
      id: 9,
      user: {
        id: 9,
        username: "james_wilson",
        first_name: "James",
        last_name: "Wilson",
        city: "Austin",
        state: "TX"
      },
      occupation: "Cybersecurity Analyst",
      industry: { id: 1, industry_name: "Technology" },
      background: "Cybersecurity analyst with 8+ years of experience in threat detection, incident response, and security architecture.",
      availability_status: "available",
      show_contact_info: true,
      photo: "/test-photos/3.png",
      expertise: [{
        what_offering: "Cybersecurity career guidance and technical mentorship",
        who_would_benefit: "IT professionals looking to transition into cybersecurity",
        why_choose_you: "I have mentored 25+ professionals in cybersecurity and helped them land roles at top security companies.",
        skills_not_offered: "Software development, marketing"
      }]
    },
    {
      id: 10,
      user: {
        id: 10,
        username: "sophie_kim",
        first_name: "Sophie",
        last_name: "Kim",
        city: "Seattle",
        state: "WA"
      },
      occupation: "Data Analyst",
      industry: { id: 2, industry_name: "Technology" },
      background: "Data analyst with expertise in SQL, Python, and business intelligence tools. Specializes in turning data into actionable insights.",
      availability_status: "available",
      show_contact_info: true,
      photo: "/test-photos/4.png",
      expertise: [{
        what_offering: "Data analysis and SQL mentorship",
        who_would_benefit: "Business professionals and students interested in data analysis",
        why_choose_you: "I have helped 20+ professionals develop their data analysis skills and advance their careers.",
        skills_not_offered: "Machine learning, web development"
      }]
    },
    {
      id: 11,
      user: {
        id: 11,
        username: "robert_taylor",
        first_name: "Robert",
        last_name: "Taylor",
        city: "Denver",
        state: "CO"
      },
      occupation: "Project Manager",
      industry: { id: 5, industry_name: "Business" },
      background: "Project manager with 10+ years of experience in agile methodologies, team leadership, and stakeholder management.",
      availability_status: "available",
      show_contact_info: true,
      photo: "/test-photos/5.png",
      expertise: [{
        what_offering: "Project management and agile methodology guidance",
        who_would_benefit: "Professionals looking to transition into project management",
        why_choose_you: "I have successfully managed 50+ projects and helped 15+ professionals become certified PMs.",
        skills_not_offered: "Technical development, design"
      }]
    },
    {
      id: 12,
      user: {
        id: 12,
        username: "emily_davis",
        first_name: "Emily",
        last_name: "Davis",
        city: "Portland",
        state: "OR"
      },
      occupation: "Content Strategist",
      industry: { id: 3, industry_name: "Marketing" },
      background: "Content strategist with expertise in content marketing, SEO, and brand storytelling. Helps businesses create compelling content that drives engagement.",
      availability_status: "available",
      show_contact_info: true,
      photo: "/test-photos/6.png",
      expertise: [{
        what_offering: "Content strategy and writing mentorship",
        who_would_benefit: "Marketing professionals and aspiring content creators",
        why_choose_you: "I have helped 30+ businesses develop their content strategy and increase their organic reach by 200%.",
        skills_not_offered: "Technical development, graphic design"
      }]
    }
  ];

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        setIsLoading(true);
        // For now, use demo data. Later this will fetch from API
        setExperts(demoExperts);
        setFilteredExperts(demoExperts);
      } catch (error) {
        console.error("Failed to fetch experts:", error);
        setError("Failed to load experts. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchExperts();
  }, []);

  useEffect(() => {
    let filtered = [...experts];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((expert) => {
        const searchableText = [
          expert.user.first_name,
          expert.user.last_name,
          expert.occupation,
          expert.industry?.industry_name,
          expert.background,
          expert.expertise?.[0]?.what_offering
        ].join(' ').toLowerCase();
        
        return searchableText.includes(searchLower);
      });
    }

    // Apply industry filter
    if (industryFilter) {
      filtered = filtered.filter(expert => 
        expert.industry?.industry_name === industryFilter
      );
    }

    // Apply location filter
    if (locationFilter) {
      filtered = filtered.filter(expert => 
        `${expert.user.city}, ${expert.user.state}` === locationFilter
      );
    }

    // Availability filter removed

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return `${a.user.first_name} ${a.user.last_name}`.localeCompare(`${b.user.first_name} ${b.user.last_name}`);
        case 'location':
          return `${a.user.city}, ${a.user.state}`.localeCompare(`${b.user.city}, ${b.user.state}`);
        case 'occupation':
          return a.occupation.localeCompare(b.occupation);
        case 'industry':
          return (a.industry?.industry_name || '').localeCompare(b.industry?.industry_name || '');
        default:
          return 0;
      }
    });

    setFilteredExperts(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [experts, searchTerm, sortBy, industryFilter, locationFilter]);

  // Get unique values for filter dropdowns
  const industries = [...new Set(experts.map(expert => expert.industry?.industry_name).filter(Boolean))];
  const locations = [...new Set(experts.map(expert => `${expert.user.city}, ${expert.user.state}`))];

  // Pagination logic
  const totalPages = Math.ceil(filteredExperts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentExperts = filteredExperts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setIndustryFilter("");
    setLocationFilter("");
    setSortBy('name');
  };

  const handleSearch = () => {
    // The search is already handled by the useEffect when searchTerm changes
    // This function can be used for additional search logic if needed
    setCurrentPage(1); // Reset to first page when searching
  };

  if (isLoading) {
    return (
      <div className="text-center">
        <Spinner color="primary" />
        <p className="mt-2">Loading experts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Alert color="danger">{error}</Alert>
      </div>
    );
  }

  return (
    <div>
        {/* Main Title and Subtitle */}
        <div className="mb-5">
          <h1 className="mb-3" style={{ fontWeight: 'bold', fontSize: '2.5rem' }}>
            Find Mensa member experts for mentorship & advice
          </h1>
          <p className="text-muted" style={{ fontSize: '1.1rem' }}>
            Type a keyword (e.g., lawyer, ML mentor, violin) and browse results below.
          </p>
        </div>

        {/* Search by Keyword Section */}
        <div className="mb-5">
          <h3 className="mb-3" style={{ fontWeight: 'bold' }}>Search by keyword</h3>
          <div className="mb-3">
            <Label for="keyword-search" className="form-label">Keywords</Label>
            <Input
              id="keyword-search"
              type="text"
              placeholder="e.g., lawyer, MLOps, violin"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ fontStyle: 'italic' }}
            />
          </div>
          <Button 
            color="primary" 
            onClick={handleSearch}
            className="mb-4"
          >
            Search
          </Button>
        </div>

        {/* Filters and Sort Controls */}
        <Row className="mb-4 align-items-center">
          <Col xs="12" md="4" className="mb-3 mb-md-0">
            <p className="text-muted mb-0">
              Showing {startIndex + 1}-{startIndex + currentExperts.length} of {filteredExperts.length} experts
              {(searchTerm || industryFilter || locationFilter) && (
                <span> (filtered from {experts.length} total)</span>
              )}
            </p>
          </Col>
          <Col xs="12" md="8">
            <div className="d-flex justify-content-md-end align-items-center gap-3 flex-wrap">
              <span className="text-muted">Industry:</span>
              <Dropdown isOpen={industryDropdownOpen} toggle={() => setIndustryDropdownOpen(!industryDropdownOpen)}>
                <DropdownToggle caret size="sm">
                  {industryFilter || 'All Industries'}
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem onClick={() => setIndustryFilter('')}>All Industries</DropdownItem>
                  {industries.map(industry => (
                    <DropdownItem key={industry} onClick={() => setIndustryFilter(industry || '')}>
                      {industry}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>

              <span className="text-muted">Location:</span>
              <Dropdown isOpen={locationDropdownOpen} toggle={() => setLocationDropdownOpen(!locationDropdownOpen)}>
                <DropdownToggle caret size="sm">
                  {locationFilter || 'All Locations'}
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem onClick={() => setLocationFilter('')}>All Locations</DropdownItem>
                  {locations.map(location => (
                    <DropdownItem key={location} onClick={() => setLocationFilter(location)}>
                      {location}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>

              <span className="text-muted">Sort by:</span>
              <Dropdown isOpen={sortDropdownOpen} toggle={() => setSortDropdownOpen(!sortDropdownOpen)}>
                <DropdownToggle caret size="sm">
                  {sortBy === 'name' ? 'Alphabetical (A - Z)' : 
                   sortBy === 'location' ? 'Location' :
                   sortBy === 'occupation' ? 'Occupation' :
                   'Industry'}
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem onClick={() => setSortBy('name')}>Alphabetical (A - Z)</DropdownItem>
                  <DropdownItem onClick={() => setSortBy('location')}>Location</DropdownItem>
                  <DropdownItem onClick={() => setSortBy('occupation')}>Occupation</DropdownItem>
                  <DropdownItem onClick={() => setSortBy('industry')}>Industry</DropdownItem>
                </DropdownMenu>
              </Dropdown>


              <Button color="secondary" onClick={clearFilters} size="sm">
                Clear Filters
              </Button>
            </div>
          </Col>
        </Row>

        {/* Expert Cards/List */}
      {currentExperts.length === 0 ? (
        <Alert color="info" className="text-center">
          {searchTerm || industryFilter || locationFilter 
            ? "No experts found matching your criteria. Try adjusting your filters." 
            : "No experts available at the moment."}
        </Alert>
      ) : (
        <>
          <Row>
              {currentExperts.map((expert) => (
                <Col md="6" lg="4" key={expert.id} className="mb-4">
                  <Card className="h-100 expert-card" style={{ border: '1px solid #e9ecef', borderRadius: '8px' }}>
                    <CardBody className="p-4">
                      {/* Photo */}
                      <div className="text-center mb-3">
                        <img
                          src={expert.photo || "https://via.placeholder.com/120x120/6c757d/ffffff?text=?"}
                          alt={`${expert.user.first_name} ${expert.user.last_name}`}
                          className="rounded-circle"
                          style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                        />
                      </div>
                      
                      {/* Name */}
                      <h5 className="text-center mb-2" style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
                        {expert.user.first_name} {expert.user.last_name}
                      </h5>
                      
                      {/* Location */}
                      <p className="text-center text-muted mb-3" style={{ fontSize: '0.9rem' }}>
                        {expert.user.city}, {expert.user.state}
                      </p>
                      
                      {/* Divider */}
                      <hr className="my-3" />
                      
                      {/* Area of Expertise */}
                      <div className="mb-3">
                        <p className="mb-1" style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
                          Area of expertise:
                        </p>
                        <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                          {expert.industry?.industry_name || 'General'} — {expert.occupation}
                        </p>
                      </div>
                      
                      {/* Description */}
                      {expert.expertise && expert.expertise[0] && (
                        <div className="mb-4">
                          <p className="text-muted" style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>
                            {expert.expertise[0].what_offering.length > 120 
                              ? `${expert.expertise[0].what_offering.substring(0, 120)}...` 
                              : expert.expertise[0].what_offering}
                          </p>
                        </div>
                      )}
                      
                      {/* Action Buttons */}
                      <div className="d-flex gap-2">
                        <Button
                          color="outline-primary"
                          size="sm"
                          tag={Link}
                          to={`/expert/${expert.user.id}`}
                          className="flex-fill"
                          style={{ borderColor: '#007bff', color: '#007bff' }}
                        >
                          See full profile
                        </Button>
                        <Button
                          color="primary"
                          size="sm"
                          tag={Link}
                          to={`/expert/${expert.user.id}`}
                          className="flex-fill"
                        >
                          Send request
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              ))}
            </Row>

          {/* Pagination */}
          {totalPages > 1 && (
            <Row className="mt-4">
              <Col md="12">
                <Pagination className="justify-content-center">
                  <PaginationItem disabled={currentPage === 1}>
                    <PaginationLink previous onClick={() => handlePageChange(currentPage - 1)} />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <PaginationItem key={page} active={page === currentPage}>
                      <PaginationLink onClick={() => handlePageChange(page)}>
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem disabled={currentPage === totalPages}>
                    <PaginationLink next onClick={() => handlePageChange(currentPage + 1)} />
                  </PaginationItem>
                </Pagination>
              </Col>
            </Row>
          )}
        </>
      )}
    </div>
  );
};

export default Experts;
