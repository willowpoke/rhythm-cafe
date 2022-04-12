import { useLevels } from "@orchard/hooks/useLevels";
import { useStore, OrchardState } from "@orchard/hooks/useStore";
import { Spinny } from "@orchard/icons";
import { Level, SearchResponseFacetCountSchema, WithClass } from "@orchard/types";
import cc from "clsx";
import { useMemo, useState } from "preact/hooks";
import "./FacetSelect.css";

type FacetSelectProps = {
    facetName: string;
    showSwitch?: boolean;
} & WithClass;

export function FacetSelect({"class": _class, facetName, showSwitch = true}: FacetSelectProps) {
    const [input, setInput] = useState("")
    const { data: resp, isLagging } = useLevels(
        {
            maxFacetValues: 10,
            facetQuery: input ? `${facetName}:${input.trim()}` : undefined
        }
    );

    const facet = useMemo(() => {
        return resp?.data.facet_counts?.find(v => v.field_name === facetName);
    }, [resp]);
    const total = facet?.stats.total_values || 0;

    const _selected = useStore(state => state.filters[facetName]?.values);
    const selected = _selected || new Set([]);
    const setFilter = useStore(state => state.setFilter);
    const filterType = useStore(state => state.filters[facetName]?.type);

    const toggle = (value: string) => {
        const currentlySelected = selected.has(value);
        if (currentlySelected) {
            setFilter(facetName, d => {
                d.values.delete(value);
            });
        } else {
            setFilter(facetName, d => {
                d.values.add(value);
            });
        }
    };

    const toggleType = () => {
        const newType = filterType === 'in' ? 'all' : 'in';
        setFilter(facetName, d => {
            d.type = newType;
        });
    }


    return (
        <div class={cc(_class, "fs", {"laggy!fs": isLagging})}>
            <div class="fs_depo">
                <span class="fs_name">{facetName}</span>
                {total > 0 && <span class="fs_total">({total})</span>}
                {isLagging && <Spinny class="fs_spinny" />}
                <div class="fs_spacer" />
                {
                    filterType && showSwitch && (
                        <div class="fs_switch">
                            <button
                                class="fs_switchbutton"
                                onClick={toggleType}
                            >
                                {filterType === 'in' ? "or" : "and"}
                            </button>
                        </div>
                    )
                }
            </div>
            <input placeholder="Filter..." class="fs_input" type="text" onInput={evt => setInput(evt.currentTarget.value)}/>
            <ul class="fs_list">
                {
                    facet && facet.counts.map(f => {
                        return (
                            <li class="fs_item" key={f.value}>
                                <label class="fs_control">
                                    <input
                                        class="fs_checkbox"
                                        type="checkbox"
                                        checked={selected.has(f.value)}
                                        onClick={() => toggle(f.value)}
                                    />
                                    {f.value}
                                </label>
                                <span class="fs_count">({f.count})</span>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}