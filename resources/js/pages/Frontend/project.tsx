import React, { useState, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
  Search,
  FolderKanban,
  Calendar,
  Building2,
  UserCheck,
  Clock,
  Eye,
  ExternalLink,
  X,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Project } from '@/types/Admin/Project';

interface ProjectIndexProps {
  projects: Project[];
}

export default function ProjectIndex({ projects = [] }: ProjectIndexProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Helper to format date strings nicely
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Status Badge Mapper (matching ProjectShow logic)
  const renderStatusBadge = (status?: string) => {
    switch (status) {
      case 'on_going':
        return (
          <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100 font-medium text-xs px-2.5 py-0.5">
            On Going
          </Badge>
        );
      case 'completed':
        return (
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100 font-medium text-xs px-2.5 py-0.5">
            Completed
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge className="bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-100 font-medium text-xs px-2.5 py-0.5">
            Cancelled
          </Badge>
        );
      case 'up_coming':
      default:
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100 font-medium text-xs px-2.5 py-0.5">
            Up Coming
          </Badge>
        );
    }
  };

  // Image URL Resolver
  const getImageUrl = (image: unknown): string | null => {
    if (!image) return null;
    const imagePath = typeof image === 'string' ? image : String(image);
    if (
      imagePath.startsWith('http://') ||
      imagePath.startsWith('https://') ||
      imagePath.startsWith('/')
    ) {
      return imagePath;
    }
    return `/${imagePath}`;
  };

  // Filter Projects
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const term = searchTerm.toLowerCase();
      const matchesTitle = project.title?.toLowerCase().includes(term);
      const matchesSupervisor = project.employee?.name
        ?.toLowerCase()
        .includes(term);
      const matchesDescription = project.description
        ?.toLowerCase()
        .includes(term);

      const matchesSearch =
        matchesTitle || matchesSupervisor || matchesDescription;

      const matchesStatus =
        statusFilter === 'all' || project.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [projects, searchTerm, statusFilter]);

  return (
    <>
      <Head title="Public Projects Directory" />

      <div className="min-h-screen bg-slate-100 py-8 px-4">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Banner */}
          <div className="bg-sky-800 text-white p-6 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <FolderKanban className="w-6 h-6 text-sky-300" />
                Projects & Public Initiatives
              </h1>
              <p className="text-xs text-sky-200 mt-1">
                Explore current municipal projects, progress statuses, and timelines
              </p>
            </div>
            <span className="bg-sky-700 text-sky-100 px-3.5 py-1.5 rounded-full text-xs font-semibold">
              Total Projects: {projects.length}
            </span>
          </div>

          {/* Search & Filter Controls */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search Bar */}
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by title, description, supervisor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {/* Status Dropdown */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">
                Filter Status:
              </span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-xl text-xs px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
              >
                <option value="all">All Projects</option>
                <option value="up_coming">Up Coming</option>
                <option value="on_going">On Going</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Table Container Layout */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-sky-900 text-white text-xs uppercase tracking-wider font-semibold border-b border-sky-950">
                    <th className="py-3.5 px-4 w-12 text-center border-r border-sky-800">
                      S.N.
                    </th>
                    <th className="py-3.5 px-4 w-1/3 border-r border-sky-800">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5" /> Project Title & Details
                      </div>
                    </th>
                    <th className="py-3.5 px-4 w-48 border-r border-sky-800">
                      <div className="flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5" /> Supervisor
                      </div>
                    </th>
                    <th className="py-3.5 px-4 w-28 text-center border-r border-sky-800">
                      <div className="flex items-center justify-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> Status
                      </div>
                    </th>
                    <th className="py-3.5 px-4 w-44 border-r border-sky-800">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" /> Timeline
                      </div>
                    </th>
                    <th className="py-3.5 px-4 w-28 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs text-slate-700">
                  {filteredProjects.length > 0 ? (
                    filteredProjects.map((project, index) => {
                      const imageUrl = getImageUrl(project.image);
                      const formattedStart = formatDate(project.start_date);
                      const formattedFinish = formatDate(project.finish_date);

                      return (
                        <tr
                          key={project.id}
                          className="hover:bg-slate-50/80 transition-colors"
                        >
                          {/* S.N. */}
                          <td className="py-4 px-4 text-center font-medium text-slate-500 align-top border-r border-slate-100">
                            {index + 1}
                          </td>

                          {/* Title & Description Brief */}
                          <td className="py-4 px-4 align-top border-r border-slate-100">
                            <div className="flex items-start gap-3">
                              {imageUrl && (
                                <button
                                  type="button"
                                  onClick={() => setPreviewImage(imageUrl)}
                                  className="shrink-0 group relative"
                                >
                                  <img
                                    src={imageUrl}
                                    alt={project.title}
                                    className="w-12 h-12 rounded-lg object-cover border border-slate-200 group-hover:opacity-80 transition-opacity"
                                  />
                                </button>
                              )}
                              <div className="space-y-1">
                                <Link
                                  href={`/projects/${project.id}`}
                                  className="font-bold text-slate-900 text-sm hover:text-sky-700 transition-colors line-clamp-1"
                                >
                                  {project.title || "Untitled Project"}
                                </Link>
                                <p className="text-slate-500 text-[11px] line-clamp-2 leading-relaxed">
                                  {project.description || "No description available."}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Supervisor */}
                          <td className="py-4 px-4 align-top border-r border-slate-100">
                            <span className="font-semibold text-slate-800">
                              {project.employee?.name || "Unassigned"}
                            </span>
                          </td>

                          {/* Status Badge */}
                          <td className="py-4 px-4 text-center align-top border-r border-slate-100">
                            {renderStatusBadge(project.status)}
                          </td>

                          {/* Start & Finish Dates */}
                          <td className="py-4 px-4 align-top border-r border-slate-100 space-y-1">
                            <div className="text-[11px]">
                              <span className="font-medium text-slate-500">Start:</span>{" "}
                              <span className="font-semibold text-slate-700">
                                {formattedStart || "N/A"}
                              </span>
                            </div>
                            <div className="text-[11px]">
                              <span className="font-medium text-slate-500">Finish:</span>{" "}
                              <span className="font-semibold text-slate-700">
                                {formattedFinish || "N/A"}
                              </span>
                            </div>
                          </td>

                          {/* Action Button */}
                          <td className="py-4 px-4 text-center align-top">
                            <Link
                              href={`/projects/${project.id}`}
                              className="inline-flex items-center gap-1 text-sky-700 hover:text-sky-900 font-semibold bg-sky-50 hover:bg-sky-100 px-3 py-1.5 rounded-lg border border-sky-200 transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" /> View
                            </Link>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-12 text-center text-slate-400 text-xs"
                      >
                        No projects found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 bg-black/50 hover:bg-black text-white p-1.5 rounded-full transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={previewImage}
              alt="Project Preview"
              className="w-full h-auto max-h-[80vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </>
  );
}