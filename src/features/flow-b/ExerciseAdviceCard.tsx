import { useState } from 'react';
import StructuredCard from '@/components/StructuredCard';
import { xhsNotes } from '@/data/xhs-notes';
import styles from './ExerciseAdviceCard.module.css';

const CORE_TIPS = [
  { num: 1, text: '五点支撑，头/上背/臀紧贴凳面，双脚踩实地面' },
  { num: 2, text: '握距约1.5倍肩宽，手腕中立位，重量落在掌根' },
  { num: 3, text: '手肘与身体约75度夹角，不要过度外展' },
];

const COMMON_MISTAKE = '手肘打开>75度导致肩关节压力过大，容易造成肩部疼痛';
const BEGINNER_TIP = '可以先从推胸机开始，掌握发力感后再过渡到自由卧推';

export default function ExerciseAdviceCard() {
  const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null);
  const [showUploadMock, setShowUploadMock] = useState(false);

  return (
    <StructuredCard>
      {/* 标题 */}
      <div className={styles.header}>卧推注意事项</div>

      {/* 核心要点 */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>核心要点：</div>
        <div className={styles.tipList}>
          {CORE_TIPS.map((tip) => (
            <div key={tip.num} className={styles.tipItem}>
              <span className={styles.tipNum}>{tip.num}.</span>
              <span className={styles.tipText}>{tip.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 常见错误 */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>⚠️ 常见错误：</div>
        <div className={styles.warningText}>{COMMON_MISTAKE}</div>
      </div>

      {/* 初学者建议 */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>💡 初学者建议：</div>
        <div className={styles.tipText}>{BEGINNER_TIP}</div>
      </div>

      {/* 小红书经验 */}
      <div className={styles.xhsSection}>
        <div className={styles.xhsHeader}>
          <span className={styles.xhsIcon}>📕</span>
          <span className={styles.xhsTitle}>查看小红书经验</span>
        </div>
        <div className={styles.noteList}>
          {xhsNotes.map((note) => (
            <div key={note.id} className={styles.noteCard}>
              <button
                className={styles.noteHeader}
                onClick={() =>
                  setExpandedNoteId((prev) => (prev === note.id ? null : note.id))
                }
              >
                <div className={styles.noteInfo}>
                  <span className={styles.noteTitle}>{note.title}</span>
                  <span className={styles.noteAuthor}>{note.author}</span>
                </div>
                <span
                  className={`${styles.noteArrow} ${expandedNoteId === note.id ? styles.noteArrowOpen : ''}`}
                >
                  ▾
                </span>
              </button>

              {expandedNoteId !== note.id && (
                <div className={styles.notePreview}>{note.preview}</div>
              )}

              {expandedNoteId === note.id && (
                <div className={styles.noteContent}>
                  {note.content.map((paragraph, idx) => (
                    <p key={idx} className={styles.noteParagraph}>
                      {paragraph.replace(/\*\*/g, '')}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 上传动作截图 */}
      <button
        className={styles.uploadBtn}
        onClick={() => setShowUploadMock(true)}
      >
        📷 上传动作截图让我看看
      </button>

      {showUploadMock && (
        <div className={styles.uploadMock}>
          <div className={styles.uploadMockIcon}>📸</div>
          <div className={styles.uploadMockText}>
            已收到你的动作截图！整体姿势不错，注意保持手腕中立位，可以稍微收紧手肘角度。继续加油！💪
          </div>
        </div>
      )}
    </StructuredCard>
  );
}
