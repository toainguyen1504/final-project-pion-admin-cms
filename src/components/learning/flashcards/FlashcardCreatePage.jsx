import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";

import {
  createFlashcard,
  bulkCreateFlashcards,
} from "@/lib/api/learning/flashcards";
import { fetchPrograms } from "@/lib/api/learning/programs";
import { fetchCoursesByProgram } from "@/lib/api/learning/courses";
import { fetchLessons } from "@/lib/api/learning/lessons";
import MultiBreadcrumb from "@/components/shared/MultiBreadcrumb";

function FlashcardCreatePage() {
  const navigate = useNavigate();

  const [programs, setPrograms] = useState([]);
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);

  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedLesson, setSelectedLesson] = useState("");

  const [vocabulary, setVocabulary] = useState(""); // vocab
  const [phonetic, setPhonetic] = useState(""); // IPA
  const [translation, setTranslation] = useState(""); // nghĩa tiếng việt
  const [exampleSentence, setExampleSentence] = useState(""); // câu ví dụ
  const [exampleTranslation, setExampleTranslation] = useState(""); // tùy chọn - dịch câu ví dụ

  const [bulkText, setBulkText] = useState("");
  const [loading, setLoading] = useState(false);

  // Load programs
  useEffect(() => {
    const loadPrograms = async () => {
      const result = await fetchPrograms();
      if (result.success) setPrograms(result.data);
    };
    loadPrograms();
  }, []);

  // Load courses khi chọn program
  useEffect(() => {
    const loadCourses = async () => {
      if (!selectedProgram) {
        setCourses([]);
        return;
      }
      const result = await fetchCoursesByProgram({ programId: Number(selectedProgram) });
      if (result.success) {
        setCourses(result.data);
      } else {
        setCourses([]);
      }
      setSelectedCourse("");
      setLessons([]);
      setSelectedLesson("");
    };
    loadCourses();
  }, [selectedProgram]);

  // Load lessons khi chọn course
  useEffect(() => {
    const loadLessons = async () => {
      if (!selectedCourse) {
        setLessons([]);
        return;
      }
      const result = await fetchLessons(Number(selectedCourse));
      if (result.success) {
        setLessons(result.data);
      } else {
        setLessons([]);
      }
      setSelectedLesson("");
    };
    loadLessons();
  }, [selectedCourse]);

  const handleCreateSingle = async (e) => {
    e.preventDefault();
    if (!selectedLesson) {
      toast.error("Vui lòng chọn Program, Course và Lesson trước khi tạo.");
      return;
    }
    setLoading(true);
    try {
      await createFlashcard({
        vocabulary: vocabulary,
        phonetic: phonetic,
        translation: translation,
        example_sentence: exampleSentence,
        example_translation: exampleTranslation, // tùy chọn
        lesson_id: Number(selectedLesson),
      });

      toast.success("Flashcard đã được tạo thành công!");
      navigate("/flashcards");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Tạo flashcard thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkCreate = async (e) => {
    e.preventDefault();
    if (!selectedLesson) {
      toast.error("Vui lòng chọn Program, Course và Lesson trước khi tạo.");
      return;
    }
    setLoading(true);
    try {
      await bulkCreateFlashcards({
        lesson_id: Number(selectedLesson),
        text: bulkText,
      });
      toast.success("Flashcards đã được tạo thành công!");
      navigate("/flashcards");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Tạo flashcards thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-6 max-w-2xl space-y-6">
      <Helmet>
        <title>Tạo Flashcard | Pion CMS</title>
      </Helmet>

      <MultiBreadcrumb
        items={[
          { label: "Flashcards", path: "/flashcards" },
          { label: "Thêm flashcard" },
        ]}
      />

      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
        Thêm Flashcard
      </h1>

      {/* Select Program → Course → Lesson */}
      <div className="flex gap-6">
        <div className="flex-1 space-y-2">
          <Label>Chọn Program</Label>
          <Select value={selectedProgram} onValueChange={setSelectedProgram}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn chương trình" />
            </SelectTrigger>
            <SelectContent>
              {programs.length === 0 ? (
                <SelectItem disabled value="no-program">
                  Không có chương trình
                </SelectItem>
              ) : (
                programs.map((p) => (
                  <SelectItem key={p.id} value={p.id.toString()}>
                    {p.title}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 space-y-2">
          <Label>Chọn Course</Label>
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn khóa học" />
            </SelectTrigger>
            <SelectContent>
              {courses.length === 0 ? (
                <SelectItem disabled value="no-course">
                  Không có khóa học
                </SelectItem>
              ) : (
                courses.map((c) => (
                  <SelectItem key={c.id} value={c.id.toString()}>
                    {c.title}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 space-y-2">
          <Label>Chọn Lesson</Label>
          <Select value={selectedLesson} onValueChange={setSelectedLesson}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn bài học" />
            </SelectTrigger>
            <SelectContent>
              {lessons.length === 0 ? (
                <SelectItem disabled value="no-lesson">
                  Không có bài học
                </SelectItem>
              ) : (
                lessons.map((l) => (
                  <SelectItem key={l.id} value={l.id.toString()}>
                    {l.title}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabs cho chế độ nhập */}
      <Tabs defaultValue="single">
        <TabsList>
          <TabsTrigger value="single">Thêm từng flashcard</TabsTrigger>
          <TabsTrigger value="bulk">Thêm nhiều flashcard</TabsTrigger>
        </TabsList>

        {/* Single flashcard */}
        <TabsContent value="single">
          <form onSubmit={handleCreateSingle} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="vocabulary">Từ vựng (English)</Label>
              <Input
                id="vocabulary"
                value={vocabulary}
                onChange={(e) => setVocabulary(e.target.value)}
                placeholder="Ví dụ: parents"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phonetic">Phiên âm</Label>
              <Input
                id="phonetic"
                value={phonetic}
                onChange={(e) => setPhonetic(e.target.value)}
                placeholder="Ví dụ: /ˈperənts/"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="translation">Nghĩa tiếng Việt</Label>
              <Input
                id="translation"
                value={translation}
                onChange={(e) => setTranslation(e.target.value)}
                placeholder="Ví dụ: bố mẹ"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="example_sentence">Câu ví dụ</Label>
              <Textarea
                id="example_sentence"
                value={exampleSentence}
                onChange={(e) => setExampleSentence(e.target.value)}
                placeholder="Ví dụ: My parents are cooking dinner."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="example_translation">Dịch câu ví dụ</Label>
              <Textarea
                id="example_translation"
                value={exampleTranslation}
                onChange={(e) => setExampleTranslation(e.target.value)}
                placeholder="Ví dụ: Bố mẹ tôi đang nấu bữa tối."
                rows={3}
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white hover:bg-indigo-500 rounded-xl w-full"
            >
              {loading ? "Đang xử lý..." : "Tạo Flashcard"}
            </Button>
          </form>
        </TabsContent>
        {/* Bulk flashcards */}
        <TabsContent value="bulk">
          <form onSubmit={handleBulkCreate} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="bulkText">Danh sách flashcards</Label>
              <Textarea
                id="bulkText"
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                placeholder={
                  "parents\t/ˈperənts/\tbố mẹ\tMy parents are cooking dinner.\tBố mẹ tôi đang nấu bữa tối"
                }
                rows={8}
                required
              />
              <p className="text-sm text-slate-500">
                Mỗi dòng là một flashcard. Các cột cách nhau bằng tab theo thứ
                tự:
                <br />
                <span className="text-sm font-medium">
                  Từ vựng → Phiên âm → Nghĩa tiếng Việt → Câu ví dụ → Dịch câu
                  ví dụ (tuỳ chọn)
                </span>
                .
              </p>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white hover:bg-indigo-500 rounded-xl w-full"
            >
              {loading ? "Đang xử lý..." : "Tạo Flashcards"}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default FlashcardCreatePage;
