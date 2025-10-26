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
import ConnectionRequestModal from "../shared/ConnectionRequestModal";
import { useApiRequest } from "../../utils/useApiRequest";
import demoExperts from '../../data/demoExperts.json';

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
  const { apiRequest } = useApiRequest();
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
  
  // Modal states for connection request
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        setIsLoading(true);
        // For now, use demo data. Later this will fetch from API

        const experts: Expert[] = await apiRequest("users/experts/");
        console.log(experts)
        debugger

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

  const openModal = (expert: Expert) => {
    setSelectedExpert(expert);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedExpert(null);
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
                          onClick={() => openModal(expert)}
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

      {/* Connection Request Modal */}
      {selectedExpert && (
        <ConnectionRequestModal
          isOpen={modalOpen}
          toggle={closeModal}
          expertName={`${selectedExpert.user.first_name} ${selectedExpert.user.last_name}`}
          expertId={selectedExpert.user.id}
        />
      )}
    </div>
  );
};

export default Experts;
