const coursesModel = require("../models/courses");
const course_sectionsModel = require("../models/course_sections");
const section_videosModel = require("../models/section_videos");

const { uploadImage, uploadVideo } = require("../middlewares/multer");

//* CRUD functions for courses
exports.addCourse = async (req, res) => {
  try {
    uploadImage.single("course_image")(req, res, async function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Image upload failed" });
      }
      if (!req.file) {
        return res.status(400).json({ error: "No image uploaded" });
      }

      const {
        course_title,
        course_description,
        course_price,
        course_rate,
        course_length,
        course_catagory,
        course_objectives,
        course_requirements,
        course_tagline,
      } = req.body;

      const trainer_id = req.user.trainer_id;
      const course_image = req.file.path;

      const courseId = await coursesModel.addCourse({
        course_author,
        course_title,
        course_description,
        course_price,
        course_rate,
        course_length,
        course_catagory,
        course_image,
        course_objectives,
        course_requirements,
        course_tagline,
        trainer_id,
      });

      res.status(201).json({
        message: "Course created successfully",
        course_id: courseId,
      });
    });
  } catch (error) {
    console.error("Failed to add course: ", error);
    res.status(500).json({ error: "Failed to add course" });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const { course_id } = req.params;
    const {
      course_title,
      course_description,
      course_price,
      course_length,
      course_catagory,
      course_objectives,
      course_requirements,
    } = req.body;

    const updatedCourseId = await coursesModel.updateCourse({
      course_id,
      course_title,
      course_description,
      course_price,
      course_length,
      course_catagory,
      course_objectives,
      course_requirements,
    });

    res.status(200).json({
      message: "Course updated successfully",
      course_id: updatedCourseId,
    });
  } catch (error) {
    console.error("Failed to update course: ", error);
    res.status(500).json({ error: "Failed to update course" });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const { course_id } = req.params;
    const deletedCourseId = await coursesModel.deleteCourse(course_id);

    res.status(200).json({
      message: "Course deleted successfully",
      course_id: deletedCourseId,
    });
  } catch (error) {
    console.error("Failed to delete course: ", error);
    res.status(500).json({ error: "Failed to delete course" });
  }
};

exports.getCourses = async (req, res) => {
  try {
    const { page = 1, pageSize = 2 } = req.query;

    const coursesWithDetails = await coursesModel.getCourses(
      parseInt(page),
      parseInt(pageSize)
    );

    if (!coursesWithDetails || coursesWithDetails.length === 0) {
      return res.status(404).json({ error: "No courses found" });
    }

    res.status(200).json({
      message: "Courses and related data retrieved successfully",
      courses: coursesWithDetails,
    });
  } catch (error) {
    console.error("Failed to retrieve courses and related data: ", error);
    return res
      .status(500)
      .json({ error: "Failed to retrieve courses and related data" });
  }
};

exports.getCourse = async (req, res) => {
  try {
    const course_id = req.params.course_id;
    const course_image = coursesModel.getCourse.course_image;
    const image_url = course_image
      ? `http://localhost:5000/${course_image}`
      : null;

    const courseWithDetails = await coursesModel.getCourse(course_id);

    if (!courseWithDetails || courseWithDetails.length === 0) {
      return res
        .status(404)
        .json({ error: "No courses found for the specified course_id" });
    }

    res.status(200).json({
      message: "Courses and related data retrieved successfully",
      course: courseWithDetails,
    });
  } catch (error) {
    console.error("Failed to retrieve courses and related data: ", error);
    return res
      .status(500)
      .json({ error: "Failed to retrieve courses and related data" });
  }
};

exports.getCoursesByFilter = async (req, res) => {
  try {
    const { catagory, page = 1, pageSize = 2 } = req.query;

    const coursesWithFilter = await coursesModel.getCoursesByFilter(
      catagory,
      parseInt(page),
      parseInt(pageSize)
    );

    if (!coursesWithFilter || coursesWithFilter.length === 0) {
      return res
        .status(404)
        .json({ error: "No courses found for the specified filter" });
    }

    res.status(200).json({
      message: "Courses retrieved successfully",
      coursesWithFilter,
    });
  } catch (error) {
    console.error("Failed to retrieve courses: ", error);
    return res.status(500).json({ error: "Failed to retrieve courses" });
  }
};

exports.getCoursesBySearch = async (req, res) => {
  try {
    const { searchTerm, page = 1, pageSize = 2 } = req.query;

    const coursesForSearch = await coursesModel.getCoursesBySearch(
      searchTerm,
      parseInt(page),
      parseInt(pageSize)
    );

    if (!coursesForSearch || coursesForSearch.length === 0) {
      return res
        .status(404)
        .json({ error: "No courses found for the specified trainer_id" });
    }

    res.status(200).json({
      message: "Courses retrieved successfully",
      coursesForSearch,
    });
  } catch (error) {
    console.error("Failed to retrieve courses: ", error);
    return res.status(500).json({ error: "Failed to retrieve courses" });
  }
};

exports.getTrainerCourses = async (req, res) => {
  try {
    const trainer_id = req.user.trainer_id;
    const { page = 1, pageSize = 10 } = req.query;

    const coursesForTrainer = await coursesModel.getTrainerCourses(
      parseInt(trainer_id),
      parseInt(page),
      parseInt(pageSize)
    );

    if (!coursesForTrainer || coursesForTrainer.length === 0) {
      return res
        .status(404)
        .json({ error: "No courses found for the specified trainer_id" });
    }

    res.status(200).json({
      message: "Trainer courses retrieved successfully",
      coursesForTrainer,
    });
  } catch (error) {
    console.error("Failed to retrieve trainer courses: ", error);
    return res
      .status(500)
      .json({ error: "Failed to retrieve trainer courses" });
  }
};

//* CRUD functions for course_sections
exports.addCourseSection = async (req, res) => {
  try {
    const { section_name } = req.body;
    const course_id = req.params.course_id;

    // Add new course section
    const newCourseSection = await course_sectionsModel.addCourseSection({
      section_name,
      course_id,
      is_deleted: false,
    });

    res.status(201).json({
      message: "Course section added successfully",
      course_section_id: newCourseSection.course_section_id,
    });
  } catch (error) {
    console.error("Failed to add the course section: ", error);
    return res.status(500).json({ error: "Failed to add the course section" });
  }
};

exports.updateCourseSection = async (req, res) => {
  try {
    const { section_name } = req.body;
    const course_section_id = req.params.course_section_id;

    // Update course section details
    await course_sectionsModel.updateCourseSection({
      course_section_id,
      section_name,
    });

    res.status(200).json({
      message: "Course section updated successfully",
    });
  } catch (error) {
    console.error("Failed to update the course section: ", error);
    return res
      .status(500)
      .json({ error: "Failed to update the course section" });
  }
};

exports.deleteCourseSection = async (req, res) => {
  try {
    const course_section_id = req.params.course_section_id;

    // Soft delete course section and associated videos
    await course_sectionsModel.deleteCourseSection(course_section_id); // Updated function name

    res.status(200).json({
      message: "Course section and associated videos soft-deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete the course section: ", error);
    return res
      .status(500)
      .json({ error: "Failed to delete the course section" });
  }
};

exports.getCourseSections = async (req, res) => {
  try {
    const course_id = req.params.course_id;

    // Get course section details
    const courseSection = await course_sectionsModel.getCourseSections(
      course_id
    );

    if (!courseSection || courseSection.length === 0) {
      return res.status(404).json({ error: "No course sections found" });
    }

    res.status(200).json({
      message: "Course section details retrieved successfully",
      courseSection,
    });
  } catch (error) {
    console.error("Failed to retrieve course section details: ", error);
    return res
      .status(500)
      .json({ error: "Failed to retrieve course section details" });
  }
};

//* CRUD functions for section_videos
exports.addCourseVideo = async (req, res) => {
  try {
    uploadVideo.single("video_link")(req, res, async function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Video upload failed" });
      }

      if (!req.file) {
        return res.status(400).json({ error: "No video uploaded" });
      }

      const { video_title } = req.body;
      const video_link = req.file.path;
      const course_section_id = req.params.course_section_id;

      // Add new section video
      const newSectionVideo = await section_videosModel.addSectionVideo({
        video_title,
        video_link,
        course_section_id,
        is_deleted: false,
      });

      res.status(201).json({
        message: "Course video added successfully",
        video_id: newSectionVideo.video_id,
      });
    });
  } catch (error) {
    console.error("Failed to add the course video: ", error);
    return res.status(500).json({ error: "Failed to add the course video" });
  }
};

exports.updateCourseVideo = async (req, res) => {
  try {
    uploadVideo.single("video_link")(req, res, async function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Video upload failed" });
      }

      if (!req.file) {
        return res.status(400).json({ error: "No video uploaded" });
      }

      const { video_title } = req.body;
      const video_link = req.file.path;
      const video_id = req.params.video_id;

      // Update section video details
      await section_videosModel.updateSectionVideo({
        video_id,
        video_title,
        video_link,
      });

      res.status(200).json({
        message: "Section video updated successfully",
      });
    });
  } catch (error) {
    console.error("Failed to update the section video: ", error);
    return res
      .status(500)
      .json({ error: "Failed to update the section video" });
  }
};

exports.deleteCourseVideo = async (req, res) => {
  try {
    const video_id = req.params.video_id;

    // Soft delete section video
    await section_videosModel.deleteSectionVideo(video_id);

    res.status(200).json({
      message: "Section video soft-deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete the section video: ", error);
    return res
      .status(500)
      .json({ error: "Failed to delete the section video" });
  }
};

exports.getSectionVideoDetails = async (req, res) => {
  try {
    const video_id = req.params.video_id;

    // Get section video details
    const sectionVideoDetails =
      await section_videosModel.getSectionVideoDetails(video_id);

    if (!sectionVideoDetails) {
      return res.status(404).json({ error: "Section video not found" });
    }

    res.status(200).json({
      message: "Section video details retrieved successfully",
      sectionVideoDetails,
    });
  } catch (error) {
    console.error("Failed to retrieve section video details: ", error);
    return res
      .status(500)
      .json({ error: "Failed to retrieve section video details" });
  }
};

exports.getSectionVideos = async (req, res) => {
  try {
    const course_section_id = req.params.course_section_id;

    // Get section video details
    const sectionVideos = await section_videosModel.getSectionVideos(
      course_section_id
    );

    if (!sectionVideos) {
      return res.status(404).json({ error: "Section video not found" });
    }

    res.status(200).json({
      message: "Section video details retrieved successfully",
      sectionVideos,
    });
  } catch (error) {
    console.error("Failed to retrieve section video details: ", error);
    return res
      .status(500)
      .json({ error: "Failed to retrieve section video details" });
  }
};

//* CRUD functions for course_objects
// exports.addCourseObject = async (req, res) => {
//   try {
//     const { object } = req.body;
//     const course_id = req.params.course_id;

//     // Add new course object
//     const newCourseObject = await addCourseObject({
//       object,
//       course_id,
//       is_deleted: false,
//     });

//     res.status(201).json({
//       message: "Course object added successfully",
//       object_id: newCourseObject.object_id,
//     });
//   } catch (error) {
//     console.error("Failed to add the course object: ", error);
//     return res.status(500).json({ error: "Failed to add the course object" });
//   }
// };

// exports.updateCourseObject = async (req, res) => {
//   try {
//     const { object } = req.body;
//     const object_id = req.params.object_id;

//     // Update course object details
//     await updateCourseObject({ object_id, object });

//     res.status(200).json({
//       message: "Course object updated successfully",
//     });
//   } catch (error) {
//     console.error("Failed to update the course object: ", error);
//     return res
//       .status(500)
//       .json({ error: "Failed to update the course object" });
//   }
// };

// exports.deleteCourseObject = async (req, res) => {
//   try {
//     const object_id = req.params.object_id;

//     // Soft delete course object
//     await deleteCourseObject(object_id);

//     res.status(200).json({
//       message: "Course object soft-deleted successfully",
//     });
//   } catch (error) {
//     console.error("Failed to delete the course object: ", error);
//     return res
//       .status(500)
//       .json({ error: "Failed to delete the course object" });
//   }
// };

// exports.getCourseObjectDetails = async (req, res) => {
//   try {
//     const course_id = req.params.course_id;

//     // Get course object details
//     const courseObjectDetails = await getCourseObjectDetails(course_id);

//     if (!courseObjectDetails || courseObjectDetails.length === 0) {
//       return res.status(404).json({ error: "No course objects found" });
//     }

//     res.status(200).json({
//       message: "Course object details retrieved successfully",
//       courseObjectDetails,
//     });
//   } catch (error) {
//     console.error("Failed to retrieve course object details: ", error);
//     return res
//       .status(500)
//       .json({ error: "Failed to retrieve course object details" });
//   }
// };

//* CRUD functions for course_requirements
// exports.addCourseRequirement = async (req, res) => {
//   try {
//     const { requirement } = req.body;
//     const course_id = req.params.course_id;

//     // Add new course requirement
//     const newCourseRequirement = await addCourseRequirement({
//       requirement,
//       course_id,
//       is_deleted: false,
//     });

//     res.status(201).json({
//       message: "Course requirement added successfully",
//       requirement_id: newCourseRequirement.requirement_id,
//     });
//   } catch (error) {
//     console.error("Failed to add the course requirement: ", error);
//     return res
//       .status(500)
//       .json({ error: "Failed to add the course requirement" });
//   }
// };

// exports.updateCourseRequirement = async (req, res) => {
//   try {
//     const { requirement } = req.body;
//     const requirement_id = req.params.requirement_id;

//     await updateCourseRequirement({ requirement_id, requirement });

//     res.status(200).json({
//       message: "Course requirement updated successfully",
//     });
//   } catch (error) {
//     console.error("Failed to update the course requirement: ", error);
//     return res
//       .status(500)
//       .json({ error: "Failed to update the course requirement" });
//   }
// };

// exports.deleteCourseRequirement = async (req, res) => {
//   try {
//     const requirement_id = req.params.requirement_id;

//     await deleteCourseRequirement(requirement_id);

//     res.status(200).json({
//       message: "Course requirement soft-deleted successfully",
//     });
//   } catch (error) {
//     console.error("Failed to delete the course requirement: ", error);
//     return res
//       .status(500)
//       .json({ error: "Failed to delete the course requirement" });
//   }
// };

// exports.getCourseRequirementDetails = async (req, res) => {
//   try {
//     const course_id = req.params.course_id;

//     // Get course requirement details
//     const courseRequirementDetails = await getCourseRequirementDetails(
//       course_id
//     );

//     if (!courseRequirementDetails || courseRequirementDetails.length === 0) {
//       return res.status(404).json({ error: "No course requirements found" });
//     }

//     res.status(200).json({
//       message: "Course requirement details retrieved successfully",
//       courseRequirementDetails,
//     });
//   } catch (error) {
//     console.error("Failed to retrieve course requirement details: ", error);
//     return res
//       .status(500)
//       .json({ error: "Failed to retrieve course requirement details" });
//   }
// };

// const {
//   addCourseObject,
//   updateCourseObject,
//   deleteCourseObject,
//   getCourseObjectDetails,
// } = require("../models/course_objects");
// const {
//   addCourseRequirement,
//   updateCourseRequirement,
//   deleteCourseRequirement,
//   getCourseRequirementDetails,
// } = require("../models/course_requirements");
