import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCheckCircle, faClock, faCalendarAlt, faListCheck, faSpinner } from '@fortawesome/free-solid-svg-icons';

const PRIORITY_BADGES = {
  Urgent: 'bg-red-50 text-red-700 border-red-200',
  High: 'bg-amber-50 text-amber-700 border-amber-200',
  Medium: 'bg-blue-50 text-blue-700 border-blue-200',
  Low: 'bg-gray-100 text-gray-700 border-gray-200',
};

export default function CrmTasksView({ tasks = [], onToggleComplete, onNewTask, loading = false }) {
  const [filterStatus, setFilterStatus] = useState('Open');
  const [updatingTaskId, setUpdatingTaskId] = useState('');

  const filtered = tasks.filter((t) => {
    if (filterStatus === 'All') return true;
    if (filterStatus === 'Open') return t.status === 'Open' || t.status === 'In Progress';
    return t.status === filterStatus;
  });

  const handleToggle = async (task) => {
    const nextStatus = task.status === 'Completed' ? 'Open' : 'Completed';
    setUpdatingTaskId(task.name);
    try {
      await onToggleComplete && onToggleComplete(task.name, nextStatus);
    } finally {
      setUpdatingTaskId('');
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white rounded-2xl border border-gray-200/90 shadow-2xs overflow-hidden flex flex-col">
      {/* Header Bar */}
      <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          {['Open', 'Completed', 'All'].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterStatus === s
                  ? 'bg-[#032e92] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <button
          onClick={() => onNewTask && onNewTask()}
          className="btn-ripple px-4 py-1.5 rounded-xl text-xs font-bold bg-[#032e92] hover:bg-[#021d63] text-white shadow-sm flex items-center gap-1.5 cursor-pointer ml-auto"
        >
          <FontAwesomeIcon icon={faPlus} className="text-[10px]" />
          <span>Add Task</span>
        </button>
      </div>

      {/* Task List */}
      <div className="p-4 sm:p-6 divide-y divide-gray-100 space-y-3">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-gray-400 font-medium text-xs">
            {loading ? 'Loading tasks...' : 'No tasks found for this view.'}
          </div>
        ) : (
          filtered.map((task) => {
            const isCompleted = task.status === 'Completed';
            const isOverdue = !isCompleted && task.due_date && task.due_date < todayStr;

            return (
              <div
                key={task.name}
                className={`pt-3 first:pt-0 flex items-start justify-between gap-3 p-3 rounded-xl transition-all ${
                  isCompleted ? 'bg-gray-50/60 opacity-60' : 'hover:bg-blue-50/40 bg-white border border-gray-100'
                }`}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <button
                    type="button"
                    onClick={() => handleToggle(task)}
                    disabled={updatingTaskId === task.name}
                    className="mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                  >
                    {updatingTaskId === task.name ? (
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin text-xs text-[#032e92]" />
                    ) : isCompleted ? (
                      <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600 text-sm" />
                    ) : (
                      <span className="w-4 h-4 rounded-md border border-gray-300 hover:border-[#032e92]" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h4 className={`text-xs font-bold truncate ${isCompleted ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                        {task.title}
                      </h4>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${PRIORITY_BADGES[task.priority] || 'bg-gray-100 text-gray-700'}`}>
                        {task.priority}
                      </span>
                      {isOverdue && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 animate-pulse">
                          Overdue
                        </span>
                      )}
                    </div>

                    {task.description && (
                      <p className="text-xs text-gray-500 mb-2 leading-relaxed">
                        {task.description}
                      </p>
                    )}

                    <div className="flex items-center gap-3 text-[11px] text-gray-400 flex-wrap">
                      <span className="flex items-center gap-1 font-medium text-gray-600">
                        <FontAwesomeIcon icon={faClock} className="text-[10px]" />
                        <span>Due: {task.due_date} {task.due_time || ''}</span>
                      </span>
                      <span className="bg-gray-100 px-2 py-0.5 rounded text-[10px] text-gray-600 font-semibold">
                        {task.activity_type}
                      </span>
                      {task.related_lead && (
                        <span className="text-[#032e92] font-semibold text-[10px] bg-blue-50 px-2 py-0.5 rounded">
                          Lead: {task.related_lead}
                        </span>
                      )}
                      {task.related_client && (
                        <span className="text-emerald-700 font-semibold text-[10px] bg-emerald-50 px-2 py-0.5 rounded">
                          Client: {task.related_client}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
